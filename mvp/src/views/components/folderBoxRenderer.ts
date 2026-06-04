import { FolderNode, FolderStructureBuilder } from './folderStructure';
import { FolderSize } from './layoutCalculator';

export class FolderBoxRenderer {
	renderAll(folder: FolderNode, folderSizes: Map<string, FolderSize>, depth = 0): string {
		const pos = folderSizes.get(folder.fullPath);
		if (!pos) return '';
		
		// Use progressively lighter colors for nested folders
		const bgOpacity = Math.max(0.12, 0.25 - depth * 0.03);
		const borderOpacity = Math.max(0.4, 0.65 - depth * 0.08);
		
		const folderIcon = this.getFolderIcon(folder.name);
		const totalCount = FolderStructureBuilder.countClasses(folder);
		
		let html = this.renderFolder(folder, pos, bgOpacity, borderOpacity, folderIcon, totalCount, depth);
		
		// Render child folders recursively
		const childFolders = Array.from(folder.children.values()).sort((a, b) => a.name.localeCompare(b.name));
		childFolders.forEach(child => {
			html += this.renderAll(child, folderSizes, depth + 1);
		});
		
		return html;
	}

	private renderFolder(
		folder: FolderNode, 
		pos: FolderSize, 
		bgOpacity: number, 
		borderOpacity: number,
		icon: string,
		totalCount: number,
		depth: number
	): string {
		const folderId = folder.fullPath.replace(/\//g, '-').replace(/[()]/g, '');
		
		return `
			<div class="folder-box" data-folder-id="${folderId}" data-folder-path="${folder.fullPath}" data-original-height="${pos.height}" style="
				position: absolute;
				left: ${pos.x}px;
				top: ${pos.y}px;
				width: ${pos.width}px;
				height: ${pos.height}px;
				background: rgba(255, 255, 255, ${bgOpacity});
				border: 2px solid rgba(102, 126, 234, ${borderOpacity});
				border-radius: 8px;
				z-index: ${5 - depth};
				pointer-events: none;
				box-sizing: border-box;
			">
				<div class="folder-header" onclick="toggleFolder('${folderId}')" style="
					padding: 10px 14px;
					background: linear-gradient(135deg, rgba(102, 126, 234, ${0.2 + depth * 0.03}), rgba(118, 75, 162, ${0.2 + depth * 0.03}));
					border-radius: 6px 6px 0 0;
					color: #222;
					font-weight: 600;
					font-size: 0.85em;
					display: flex;
					align-items: center;
					gap: 6px;
					pointer-events: auto;
					cursor: pointer;
					user-select: none;
				">
					<span class="collapse-icon" id="collapse-${folderId}" style="font-size: 0.9em; transition: transform 0.2s;">▼</span>
					<span style="font-size: 1.1em;">${icon}</span>
					<span>${folder.name}</span>
					${totalCount > 0 ? `<span style="
						background: rgba(102, 126, 234, 0.2);
						padding: 2px 6px;
						border-radius: 8px;
						font-size: 0.8em;
						margin-left: auto;
					">${totalCount}</span>` : ''}
				</div>
			</div>
		`;
	}

	private getFolderIcon(folderName: string): string {
		if (folderName.includes('command')) return '⚡';
		if (folderName.includes('service')) return '⚙️';
		if (folderName.includes('view')) return '👁️';
		if (folderName.includes('type')) return '📝';
		if (folderName.includes('l1_ui')) return '🎨';
		if (folderName.includes('l2_controller')) return '🎮';
		if (folderName.includes('l3_model')) return '📦';
		if (folderName.includes('l4_infra')) return '🔧';
		if (folderName.includes('app')) return '📱';
		return '📁';
	}
}
