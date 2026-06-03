import * as vscode from 'vscode';
import { CodeParserService } from '../services/codeParserService';
import { DiagramGeneratorService } from '../services/diagramGeneratorService';
import { ClassDiagramView } from '../views/classDiagramView';

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
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Generating class diagram...",
			cancellable: false
		}, async (progress) => {
			// Parse workspace
			progress.report({ message: 'Analyzing code...' });
			const diagramData = await CodeParserService.parseWorkspace(workspacePath);

			if (diagramData.classes.length === 0) {
				vscode.window.showWarningMessage('No classes found in src folder!');
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

			vscode.window.showInformationMessage(
				`Found ${diagramData.classes.length} classes with ${diagramData.relationships.length} relationships!`
			);
		});

	} catch (error) {
		vscode.window.showErrorMessage(`Error generating diagram: ${error}`);
	}
}
