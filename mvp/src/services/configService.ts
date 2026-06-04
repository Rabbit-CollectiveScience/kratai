import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { KrataiConfig } from '../types/config';

export class ConfigService {
	private static readonly CONFIG_FILE = '.vscode/kratai.json';

	static getDefaultConfig(): KrataiConfig {
		return {
			selectedFolders: [],  // Empty = all folders except node_modules/dist
			selectedExtensions: ['.ts', '.tsx'],
			respectGitignore: true,
			followSymlinks: false
		};
	}

	static generateSmartDefaults(workspacePath: string): KrataiConfig {
		// Common folder patterns for different project types
		const commonSourceFolders = [
			'src',
			'lib',
			'app',
			'packages',
			'server',
			'client',
			'api',
			'services',
			'components',
			'modules',
			'core'
		];

		const detectedFolders: string[] = [];

		// Check which common folders exist
		for (const folderName of commonSourceFolders) {
			const folderPath = path.join(workspacePath, folderName);
			if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
				detectedFolders.push(folderName);
			}
		}

		// If no common folders found, default to empty (scan all)
		const selectedFolders = detectedFolders.length > 0 ? detectedFolders : [];

		// Detect file types in the project
		const extensions = this.detectFileExtensions(workspacePath);

		return {
			selectedFolders,
			selectedExtensions: extensions,
			respectGitignore: true,
			followSymlinks: false
		};
	}

	private static detectFileExtensions(workspacePath: string): string[] {
		// Default to TypeScript
		let detectedExtensions = ['.ts', '.tsx'];

		// Check for package.json to detect project type
		const packageJsonPath = path.join(workspacePath, 'package.json');
		if (fs.existsSync(packageJsonPath)) {
			try {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
				const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

				// Check for TypeScript
				const hasTypeScript = deps['typescript'] || deps['@types/node'];
				// Check for JavaScript frameworks
				const hasReact = deps['react'];
				const hasVue = deps['vue'];
				
				if (hasTypeScript) {
					detectedExtensions = hasReact ? ['.ts', '.tsx'] : ['.ts'];
				} else {
					detectedExtensions = hasReact ? ['.js', '.jsx'] : ['.js'];
				}

				// Add .vue if Vue detected
				if (hasVue) {
					detectedExtensions.push('.vue');
				}
			} catch (error) {
				// Fallback to defaults
			}
		}

		return detectedExtensions;
	}

	static getProjectInfo(config: KrataiConfig): string {
		if (config.selectedFolders.length === 0) {
			return '📂 Scanning all folders (except node_modules, dist, build, out, .git)';
		}

		const folderList = config.selectedFolders.join(', ');
		const extList = config.selectedExtensions.join(', ');
		return `📂 Folders: ${folderList}\n📄 Extensions: ${extList}`;
	}

	static async loadConfig(workspacePath: string): Promise<KrataiConfig> {
		const configPath = path.join(workspacePath, this.CONFIG_FILE);
		
		if (!fs.existsSync(configPath)) {
			// No config file exists - generate smart defaults
			return this.generateSmartDefaults(workspacePath);
		}

		try {
			const content = fs.readFileSync(configPath, 'utf-8');
			const config = JSON.parse(content) as KrataiConfig;
			
			// Merge with defaults to handle missing fields
			return {
				...this.getDefaultConfig(),
				...config
			};
		} catch (error) {
			console.error('Error loading Kratai config:', error);
			return this.generateSmartDefaults(workspacePath);
		}
	}

	static async saveConfig(workspacePath: string, config: KrataiConfig): Promise<void> {
		const configPath = path.join(workspacePath, this.CONFIG_FILE);
		const vscodeDir = path.dirname(configPath);

		// Create .vscode directory if it doesn't exist
		if (!fs.existsSync(vscodeDir)) {
			fs.mkdirSync(vscodeDir, { recursive: true });
		}

		const configWithTimestamp = {
			...config,
			lastUpdated: new Date().toISOString()
		};

		fs.writeFileSync(configPath, JSON.stringify(configWithTimestamp, null, 2), 'utf-8');
	}

	static shouldIncludeFolder(folderPath: string, config: KrataiConfig): boolean {
		// Default exclusions
		const defaultExclusions = ['node_modules', 'dist', 'build', 'out', '.git'];
		
		const relativePath = folderPath.replace(/\\/g, '/');
		
		// Check default exclusions
		for (const exclusion of defaultExclusions) {
			if (relativePath.includes(`/${exclusion}/`) || relativePath.endsWith(`/${exclusion}`) || relativePath === exclusion) {
				return false;
			}
		}

		// If no folders selected, include everything (except defaults)
		if (config.selectedFolders.length === 0) {
			return true;
		}

		// Check if folder is in selected list or is a parent/child of selected
		for (const selected of config.selectedFolders) {
			if (relativePath === selected || 
			    relativePath.startsWith(selected + '/') || 
			    selected.startsWith(relativePath + '/')) {
				return true;
			}
		}

		return false;
	}

	static shouldIncludeFile(filePath: string, config: KrataiConfig): boolean {
		const ext = path.extname(filePath);
		return config.selectedExtensions.includes(ext);
	}
}
