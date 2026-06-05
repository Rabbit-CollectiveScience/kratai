import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { CodeParserService } from '../services/codeParserService';
import { DiagramGeneratorService } from '../services/diagramGeneratorService';
import { ClassDiagramView } from '../views/classDiagramView';
import { ConfigService } from '../services/configService';

export async function generateClassDiagram(context: vscode.ExtensionContext): Promise<void> {
	// Check if workspace is opened
	if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
		vscode.window.showErrorMessage('No workspace folder is open!');
		return;
	}

	const workspaceFolder = vscode.workspace.workspaceFolders[0];
	const workspacePath = workspaceFolder.uri.fsPath;
	const workspaceName = workspaceFolder.name;

	try {
		// Check if config file exists
		const configPath = path.join(workspacePath, '.vscode/kratai.json');
		const configExists = fs.existsSync(configPath);

		if (configExists) {
			// Config exists, generate diagram directly
			await generateClassDiagramDirect(context);
		} else {
			// No config, show config panel first to let user review/modify before generating
			vscode.commands.executeCommand('kratai.showConfigPanel');
		}

	} catch (error) {
		vscode.window.showErrorMessage(`Error loading configuration: ${error}`);
	}
}

// New function for direct diagram generation (called from config panel)
export async function generateClassDiagramDirect(context: vscode.ExtensionContext): Promise<void> {
	// Check if workspace is opened
	if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
		vscode.window.showErrorMessage('No workspace folder is open!');
		return;
	}

	const workspaceFolder = vscode.workspace.workspaceFolders[0];
	const workspacePath = workspaceFolder.uri.fsPath;
	const workspaceName = workspaceFolder.name;

	try {
		// Load config and show info
		const config = await ConfigService.loadConfig(workspacePath);
		const configInfo = ConfigService.getProjectInfo(config);
		
		console.log('🔍 Kratai Config:', configInfo);

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Generating class diagram...",
			cancellable: false
		}, async (progress) => {
			// Parse workspace
			progress.report({ message: 'Analyzing code...' });
			const diagramData = await CodeParserService.parseWorkspace(workspacePath);

			// Normalize file paths to workspace-relative (fixes path mismatch bugs)
			diagramData.classes.forEach(classInfo => {
				if (classInfo.filePath.includes(workspacePath)) {
					// Convert absolute to relative
					classInfo.filePath = classInfo.filePath.substring(workspacePath.length + 1);
				}
			});

			// Deduplicate classes (config with overlapping folder paths causes duplicates)
			const originalCount = diagramData.classes.length;
			const classMap = new Map<string, typeof diagramData.classes[0]>();
			diagramData.classes.forEach(classInfo => {
				const key = `${classInfo.filePath}:${classInfo.name}`;
				if (!classMap.has(key)) {
					classMap.set(key, classInfo);
				}
			});
			diagramData.classes = Array.from(classMap.values());
			
			if (originalCount > diagramData.classes.length) {
				console.log(`🔧 Deduplicated: ${originalCount} → ${diagramData.classes.length} classes (removed ${originalCount - diagramData.classes.length} duplicates)`);
			}

			// Apply class type filters
			const classTypes = config.classTypes || {
				showClasses: true,
				showInterfaces: true,
				showAbstract: true,
				showEnums: true
			};

			const originalClassCount = diagramData.classes.length;
			diagramData.classes = diagramData.classes.filter(classInfo => {
				if (classInfo.isInterface && !classTypes.showInterfaces) {
					return false;
				}
				if (classInfo.isAbstract && !classInfo.isInterface && !classTypes.showAbstract) {
					return false;
				}
				// TODO: Add enum detection logic when available
				// For now, if it's not interface or abstract, it's a regular class
				if (!classInfo.isInterface && !classInfo.isAbstract && !classTypes.showClasses) {
					return false;
				}
				return true;
			});

			console.log(`🔍 Class type filter: ${originalClassCount} → ${diagramData.classes.length} classes`);

			// Apply relationship type filters
			const relationshipTypes = config.relationshipTypes || {
				showExtends: true,
				showImplements: true,
				showComposition: true,
				showUses: true
			};

			const originalRelCount = diagramData.relationships.length;
			diagramData.relationships = diagramData.relationships.filter(rel => {
				if (rel.type === 'extends' && !relationshipTypes.showExtends) {
					return false;
				}
				if (rel.type === 'implements' && !relationshipTypes.showImplements) {
					return false;
				}
				if (rel.type === 'composition' && !relationshipTypes.showComposition) {
					return false;
				}
				if (rel.type === 'uses' && !relationshipTypes.showUses) {
					return false;
				}
				return true;
			});

			console.log(`🔍 Relationship filter: ${originalRelCount} → ${diagramData.relationships.length} relationships`);

			// Remove relationships referencing filtered-out classes
			const classNames = new Set(diagramData.classes.map(c => c.name));
			diagramData.relationships = diagramData.relationships.filter(rel => 
				classNames.has(rel.from) && classNames.has(rel.to)
			);

			console.log(`🔍 Cleaned relationships: ${diagramData.relationships.length} relationships after removing orphans`);

			if (diagramData.classes.length === 0) {
				vscode.window.showWarningMessage('No classes match the selected filters!');
				return;
			}

			// Generate diagram data
			progress.report({ message: 'Generating diagram...' });
			const { nodes, edges } = DiagramGeneratorService.generateReactFlowData(diagramData);

			// Create and show webview
			const panel = vscode.window.createWebviewPanel(
				'krataiClassDiagram',
				'📊 Class Diagram',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);

			panel.webview.html = ClassDiagramView.generate(nodes, edges, workspaceName);

			// Handle messages from the webview
			panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'openSettings':
							vscode.commands.executeCommand('kratai.showConfigPanel');
							break;
					}
				},
				undefined,
				context.subscriptions
			);

			vscode.window.showInformationMessage(
				`Found ${diagramData.classes.length} classes with ${diagramData.relationships.length} relationships!`
			);
		});

	} catch (error) {
		vscode.window.showErrorMessage(`Error generating diagram: ${error}`);
	}
}
