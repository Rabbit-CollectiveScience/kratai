import { FolderNode } from './folderStructure';

export interface LayoutConfig {
	boxWidth: number;
	boxHeight: number;
	classSpacing: number;
	folderHeaderHeight: number;
	folderPadding: number;
	folderMargin: number;
}

export interface Position {
	x: number;
	y: number;
}

export interface FolderSize extends Position {
	width: number;
	height: number;
}

export class HierarchicalLayoutCalculator {
	private classPositions = new Map<string, Position>();
	private folderSizes = new Map<string, FolderSize>();
	
	constructor(private config: LayoutConfig) {}

	calculate(folder: FolderNode, x: number, y: number): { width: number; height: number } {
		let contentY = y + this.config.folderHeaderHeight + this.config.folderPadding;
		let maxWidth = 0;
		const currentX = x + this.config.folderPadding;
		
		// Layout classes in this folder first
		if (folder.classes.length > 0) {
			const nodesPerRow = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(folder.classes.length))));
			
			folder.classes.forEach((node, index) => {
				const col = index % nodesPerRow;
				const row = Math.floor(index / nodesPerRow);
				
				const classX = currentX + col * (this.config.boxWidth + this.config.classSpacing);
				const classY = contentY + row * (this.config.boxHeight + this.config.classSpacing);
				
				// Store position with COMPOSITE KEY (filePath:className) for uniqueness
				// Many files have multiple classes (e.g., types.ts with 15 types)
				const uniqueKey = `${node.data.classInfo.filePath}:${node.data.classInfo.name}`;
				this.classPositions.set(uniqueKey, { x: classX, y: classY });
				
				// Debug log - show both name and path
				console.log(`Positioned ${node.data.classInfo.name} at (${classX}, ${classY}) in folder ${folder.fullPath} [${uniqueKey}]`);
			});
			
			const classRows = Math.ceil(folder.classes.length / nodesPerRow);
			const classAreaHeight = classRows * this.config.boxHeight + (classRows - 1) * this.config.classSpacing;
			const classAreaWidth = Math.min(nodesPerRow, folder.classes.length) * this.config.boxWidth + 
								   (Math.min(nodesPerRow, folder.classes.length) - 1) * this.config.classSpacing;
			
			contentY += classAreaHeight + this.config.folderMargin;
			maxWidth = Math.max(maxWidth, classAreaWidth);
		}
		
		// Layout child folders below classes
		const childFolders = Array.from(folder.children.values()).sort((a, b) => a.name.localeCompare(b.name));
		childFolders.forEach(child => {
			const childSize = this.calculate(child, currentX, contentY);
			contentY += childSize.height + this.config.folderMargin;
			maxWidth = Math.max(maxWidth, childSize.width);
		});
		
		// Ensure minimum folder size to prevent overlapping
		const minWidth = folder.classes.length > 0 || folder.children.size > 0 ? 250 : 200;
		const totalWidth = Math.max(maxWidth, minWidth) + this.config.folderPadding * 2;
		const totalHeight = Math.max(contentY - y + this.config.folderPadding, 80); // Minimum height
		
		this.folderSizes.set(folder.fullPath, { x, y, width: totalWidth, height: totalHeight });
		
		return { width: totalWidth, height: totalHeight };
	}

	getClassPosition(filePath: string, className: string): Position | undefined {
		const key = `${filePath}:${className}`;
		return this.classPositions.get(key);
	}
	
	getStoredPositionsCount(): number {
		return this.classPositions.size;
	}
	
	getAllStoredPaths(): string[] {
		return Array.from(this.classPositions.keys());
	}

	getFolderSize(folderPath: string): FolderSize | undefined {
		return this.folderSizes.get(folderPath);
	}

	getCanvasSize(rootSize: { width: number; height: number }): { width: number; height: number } {
		return {
			width: 40 + rootSize.width + 50,
			height: 40 + rootSize.height + 50
		};
	}
}
