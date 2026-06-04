import { ReactFlowNode } from '../../types/diagram';

export interface FolderNode {
	name: string;
	fullPath: string;
	children: Map<string, FolderNode>;
	classes: ReactFlowNode[];
}

export class FolderStructureBuilder {
	static build(nodes: ReactFlowNode[]): FolderNode {
		const root: FolderNode = { 
			name: 'src', 
			fullPath: 'src', 
			children: new Map(), 
			classes: [] 
		};

		nodes.forEach(node => {
			const filePath = node.data.classInfo.filePath;
			// Match any file under src/, extracting the folder path
			const match = filePath.match(/src\/(.+)\/[^\/]+\.tsx?$/);
			
			if (match) {
				// File has a folder path like src/commands/file.ts or src/l1_ui/components/file.tsx
				const pathParts = match[1].split('/');
				
				let current = root;
				let currentPath = 'src';
				
				pathParts.forEach(part => {
					currentPath += '/' + part;
					if (!current.children.has(part)) {
						current.children.set(part, {
							name: part,
							fullPath: currentPath,
							children: new Map(),
							classes: []
						});
					}
					current = current.children.get(part)!;
				});
				
				current.classes.push(node);
			} else {
				// File is directly in src/ (no subfolder)
				root.classes.push(node);
			}
		});

		return root;
	}

	static logStructure(folder: FolderNode, indent = ''): void {
		console.log(`${indent}📁 ${folder.name} (${folder.classes.length} classes)`);
		folder.classes.forEach(node => {
			console.log(`${indent}  └─ ${node.data.classInfo.name}`);
		});
		folder.children.forEach(child => this.logStructure(child, indent + '  '));
	}

	static countClasses(folder: FolderNode): number {
		let count = folder.classes.length;
		folder.children.forEach(child => count += this.countClasses(child));
		return count;
	}

	static countFolders(folder: FolderNode): number {
		let count = 1;
		folder.children.forEach(child => count += this.countFolders(child));
		return count;
	}
}
