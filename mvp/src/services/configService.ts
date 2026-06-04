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

	static async loadConfig(workspacePath: string): Promise<KrataiConfig> {
		const configPath = path.join(workspacePath, this.CONFIG_FILE);
		
		if (!fs.existsSync(configPath)) {
			return this.getDefaultConfig();
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
			return this.getDefaultConfig();
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
