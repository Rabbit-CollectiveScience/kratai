export interface KrataiConfig {
	selectedFolders: string[];      // Relative paths from workspace root
	selectedExtensions: string[];   // [".ts", ".tsx", etc.]
	respectGitignore?: boolean;     // Default: true
	followSymlinks?: boolean;       // Default: false
	classTypes?: {                  // Filter by class types
		showClasses?: boolean;      // Regular classes (default: true)
		showInterfaces?: boolean;   // Interfaces (default: true)
		showAbstract?: boolean;     // Abstract classes (default: true)
		showEnums?: boolean;        // Enums (default: true)
	};
	relationshipTypes?: {           // Filter by relationship types
		showExtends?: boolean;      // Inheritance (default: true)
		showImplements?: boolean;   // Interface implementation (default: true)
		showComposition?: boolean;  // Composition (default: true)
		showUses?: boolean;         // Usage/dependency (default: true)
	};
}

export interface FolderNode {
	path: string;           // Relative path
	name: string;           // Folder name
	selected: boolean;
	children: FolderNode[];
	fileCount?: number;     // Number of parseable files
}

export interface ExtensionInfo {
	extension: string;      // e.g., ".ts"
	count: number;          // Number of files
	selected: boolean;
}
