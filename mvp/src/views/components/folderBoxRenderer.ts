import { FolderNode, FolderStructureBuilder } from './folderStructure';
import { FolderSize } from './layoutCalculator';

export class FolderBoxRenderer {
	renderAll(folder: FolderNode, folderSizes: Map<string, FolderSize>, depth = 0): string {
		const pos = folderSizes.get(folder.fullPath);
		if (!pos) return '';
		
		const folderIcon = this.getFolderIcon(folder.name);
		const totalCount = FolderStructureBuilder.countClasses(folder);
		
		let html = this.renderFolder(folder, pos, folderIcon, totalCount, depth);
		
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
		icon: string,
		totalCount: number,
		depth: number
	): string {
		const tabWidth = Math.min(180, Math.max(120, folder.name.length * 8 + 60));
		
		return `
			<!-- Package Tab -->
			<div style="
				position: absolute;
				left: ${pos.x}px;
				top: ${pos.y - 28}px;
				width: ${tabWidth}px;
				height: 28px;
				background: #ddd;
				border: 1px solid #000;
				border-bottom: none;
				z-index: ${6 - depth};
				pointer-events: auto;
			">
				<div style="
					padding: 5px 12px;
					color: #000;
					font-weight: 600;
					font-size: 13px;
					display: flex;
					align-items: center;
					gap: 6px;
					height: 100%;
				">
					<span>${icon}</span>
					<span>${folder.name}</span>
					${totalCount > 0 ? `<span style="
						background: #999;
						padding: 2px 6px;
						font-size: 11px;
						margin-left: auto;
						color: #fff;
					">${totalCount}</span>` : ''}
				</div>
			</div>
			<!-- Package Body -->
			<div class="folder-box" style="
				position: absolute;
				left: ${pos.x}px;
				top: ${pos.y}px;
				width: ${pos.width}px;
				height: ${pos.height}px;
				background: transparent;
				border: 1px solid #000;
				z-index: ${5 - depth};
				pointer-events: none;
			">
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
