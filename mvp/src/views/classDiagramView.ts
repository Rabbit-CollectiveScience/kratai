import { ReactFlowNode, ReactFlowEdge } from '../types/diagram';

export class ClassDiagramView {
	
	static generate(nodes: ReactFlowNode[], edges: ReactFlowEdge[], workspaceName: string): string {
		// Group classes by folder
		const folderGroups: Map<string, ReactFlowNode[]> = new Map();
		
		nodes.forEach(node => {
			const filePath = node.data.classInfo.filePath;
			// Extract folder path from file path (e.g., "src/commands")
			const match = filePath.match(/src\/(.+?)\/[^\/]+\.ts$/);
			const folder = match ? `src/${match[1]}` : 'src';
			
			if (!folderGroups.has(folder)) {
				folderGroups.set(folder, []);
			}
			folderGroups.get(folder)!.push(node);
		});

		// Sort folders alphabetically
		const sortedFolders = Array.from(folderGroups.entries()).sort((a, b) => a[0].localeCompare(b[0]));

		// Layout configuration
		const boxWidth = 260;
		const boxHeight = 200; // Approximate
		const classSpacing = 25;
		const folderSpacing = 60;
		const folderPadding = 50;
		const startX = 40;
		const startY = 40;
		
		// Calculate positions for each folder group
		let currentX = startX;
		const folderPositions = new Map<string, { x: number; y: number; width: number; height: number }>();
		const classPositions = new Map<string, { x: number; y: number }>();

		sortedFolders.forEach(([folder, folderNodes]) => {
			// Calculate grid layout within folder
			const nodesPerRow = Math.ceil(Math.sqrt(folderNodes.length));
			const rows = Math.ceil(folderNodes.length / nodesPerRow);
			
			const folderWidth = nodesPerRow * (boxWidth + classSpacing) + folderPadding * 2 - classSpacing;
			const folderHeight = rows * (boxHeight + classSpacing) + folderPadding * 2 + 40; // +40 for folder header
			
			folderPositions.set(folder, { 
				x: currentX, 
				y: startY, 
				width: folderWidth, 
				height: folderHeight 
			});

			// Position classes within folder
			folderNodes.forEach((node, index) => {
				const row = Math.floor(index / nodesPerRow);
				const col = index % nodesPerRow;
				
				const x = currentX + folderPadding + col * (boxWidth + classSpacing);
				const y = startY + folderPadding + 40 + row * (boxHeight + classSpacing); // +40 for folder header
				
				classPositions.set(node.data.classInfo.name, { x, y });
			});

			currentX += folderWidth + folderSpacing;
		});

		const nodeMap = new Map(nodes.map(n => [n.data.classInfo.name, n]));

		// Generate folder backgrounds
		const folderBackgrounds = sortedFolders.map(([folder]) => {
			const pos = folderPositions.get(folder)!;
			const folderIcon = folder.includes('commands') ? '⚡' : 
							   folder.includes('services') ? '⚙️' : 
							   folder.includes('views') ? '👁️' : 
							   folder.includes('types') ? '📝' : '📁';
			const folderNodes = folderGroups.get(folder)!;
			
			return `
				<div style="
					position: absolute;
					left: ${pos.x}px;
					top: ${pos.y}px;
					width: ${pos.width}px;
					height: ${pos.height}px;
					background: rgba(255, 255, 255, 0.08);
					border: 2px solid rgba(102, 126, 234, 0.3);
					border-radius: 12px;
					backdrop-filter: blur(10px);
				">
					<div style="
						padding: 10px 15px;
						background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
						border-radius: 10px 10px 0 0;
						color: white;
						font-weight: 600;
						font-size: 0.95em;
						display: flex;
						align-items: center;
						gap: 8px;
					">
						<span style="font-size: 1.2em;">${folderIcon}</span>
						<span>${folder}</span>
						<span style="
							background: rgba(255, 255, 255, 0.3);
							padding: 2px 8px;
							border-radius: 10px;
							font-size: 0.85em;
							margin-left: auto;
						">${folderNodes.length}</span>
					</div>
				</div>
			`;
		}).join('');

		// Generate UML boxes
		const classBoxes = nodes.map(node => {
			const classInfo = node.data.classInfo;
			const className = classInfo.name;
			const pos = classPositions.get(className) || { x: 50, y: 50 };
			
			const borderColor = classInfo.isInterface ? '#4ecdc4' : classInfo.isAbstract ? '#ff6b6b' : '#667eea';
			const borderStyle = classInfo.isInterface ? 'dashed' : 'solid';

			return `
				<div class="uml-box" data-class="${className}" style="
					position: absolute;
					left: ${pos.x}px;
					top: ${pos.y}px;
					width: ${boxWidth}px;
					background: white;
					border: 3px ${borderStyle} ${borderColor};
					border-radius: 4px;
					box-shadow: 0 2px 8px rgba(0,0,0,0.15);
					font-family: 'Courier New', monospace;
					font-size: 0.8em;
				">
					<!-- Class name compartment -->
					<div style="
						background: ${borderColor};
						color: white;
						padding: 10px;
						text-align: center;
						font-weight: bold;
						font-size: 0.95em;
						border-radius: 1px 1px 0 0;
					">
						${classInfo.isInterface ? '«interface»<br>' : classInfo.isAbstract ? '«abstract»<br>' : ''}${className}
					</div>
					
					<!-- Properties compartment -->
					<div style="
						padding: 8px;
						border-bottom: 1px solid ${borderColor};
						min-height: 30px;
						max-height: 70px;
						overflow: hidden;
						background: #fafafa;
						font-size: 0.8em;
					">
						${classInfo.properties.length > 0 ? classInfo.properties.slice(0, 4).map(prop => `
							<div style="padding: 2px 4px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
								<span style="color: ${prop.visibility === 'private' ? '#e74c3c' : prop.visibility === 'protected' ? '#f39c12' : '#27ae60'};">
									${prop.visibility === 'private' ? '-' : prop.visibility === 'protected' ? '#' : '+'}
								</span>
								${prop.name}
							</div>
						`).join('') : '<div style="color: #999; font-style: italic; padding: 4px;">No properties</div>'}
						${classInfo.properties.length > 4 ? `<div style="color: #999; font-style: italic; padding: 2px 4px;">+${classInfo.properties.length - 4}</div>` : ''}
					</div>
					
					<!-- Methods compartment -->
					<div style="
						padding: 8px;
						min-height: 30px;
						max-height: 70px;
						overflow: hidden;
						font-size: 0.8em;
					">
						${classInfo.methods.length > 0 ? classInfo.methods.slice(0, 4).map(method => `
							<div style="padding: 2px 4px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
								<span style="color: ${method.visibility === 'private' ? '#e74c3c' : method.visibility === 'protected' ? '#f39c12' : '#27ae60'};">
									${method.visibility === 'private' ? '-' : method.visibility === 'protected' ? '#' : '+'}
								</span>
								${method.name}()
							</div>
						`).join('') : '<div style="color: #999; font-style: italic; padding: 4px;">No methods</div>'}
						${classInfo.methods.length > 4 ? `<div style="color: #999; font-style: italic; padding: 2px 4px;">+${classInfo.methods.length - 4}</div>` : ''}
					</div>
				</div>
			`;
		}).join('');

		// Generate SVG lines for relationships
		const svgLines = edges.map(edge => {
			const sourcePos = classPositions.get(edge.source);
			const targetPos = classPositions.get(edge.target);
			if (!sourcePos || !targetPos) return '';

			// Calculate connection points (center of boxes)
			const sourceX = sourcePos.x + boxWidth / 2;
			const sourceY = sourcePos.y + boxHeight / 2;
			const targetX = targetPos.x + boxWidth / 2;
			const targetY = targetPos.y + boxHeight / 2;

			const color = edge.type === 'extends' ? '#ff6b6b' : edge.type === 'implements' ? '#4ecdc4' : '#999';
			const dashArray = edge.type === 'implements' ? '5,5' : '0';
			const markerEnd = edge.type === 'implements' ? 'url(#triangle-implements)' : 'url(#triangle-extends)';
			
			// Draw curved line for better visibility
			const midX = (sourceX + targetX) / 2;
			const midY = (sourceY + targetY) / 2;
			const dx = targetX - sourceX;
			const dy = targetY - sourceY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const offset = Math.min(30, dist / 4);
			const controlX = midX - dy * offset / dist;
			const controlY = midY + dx * offset / dist;
			
			return `
				<path 
					d="M ${sourceX},${sourceY} Q ${controlX},${controlY} ${targetX},${targetY}"
					stroke="${color}"
					stroke-width="1.5"
					fill="none"
					stroke-dasharray="${dashArray}"
					marker-end="${markerEnd}"
					opacity="0.6"
				/>
			`;
		}).join('');

		// Calculate canvas size
		const maxX = currentX + 50;
		const maxFolderHeight = Math.max(...Array.from(folderPositions.values()).map(p => p.height));
		const maxY = startY + maxFolderHeight + 50;

		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UML Class Diagram</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .header {
            position: sticky;
            top: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            margin: 0;
            font-size: 1.5em;
            color: #667eea;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 0.9em;
        }
        .stats {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 0.9em;
        }
        .search-box {
            margin: 0 20px;
            flex: 1;
            max-width: 400px;
        }
        .search-box input {
            width: 100%;
            padding: 10px;
            border: 2px solid #667eea;
            border-radius: 8px;
            font-size: 0.9em;
        }
        .diagram-container {
            position: relative;
            width: ${maxX}px;
            height: ${maxY}px;
            margin: 30px;
            transform-origin: top left;
        }
        .uml-box {
            transition: all 0.2s;
            cursor: pointer;
        }
        .uml-box:hover {
            transform: scale(1.05);
            z-index: 100;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .zoom-controls {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1001;
        }
        .zoom-controls button {
            display: block;
            margin: 5px 0;
            padding: 8px 16px;
            border: none;
            background: #667eea;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
        }
        .zoom-controls button:hover {
            background: #5568d3;
        }
        .legend {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1001;
            font-size: 0.85em;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 5px 0;
        }
        .legend-line {
            width: 30px;
            height: 2px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>📊 UML Class Diagram</h1>
            <p>${workspaceName} • ${nodes.length} classes • ${edges.length} relationships</p>
        </div>
        <div class="search-box">
            <input type="text" id="search" placeholder="Search classes..." oninput="filterClasses(this.value)">
        </div>
        <div class="stats">
            ${sortedFolders.length} folders
        </div>
    </div>
    
    <div class="zoom-controls">
        <button onclick="zoomIn()">🔍 Zoom In</button>
        <button onclick="zoomOut()">🔍 Zoom Out</button>
        <button onclick="resetZoom()">↺ Reset</button>
    </div>
    
    <div class="legend">
        <div style="font-weight: 600; margin-bottom: 8px;">Relationships</div>
        <div class="legend-item">
            <div class="legend-line" style="background: #ff6b6b;"></div>
            <span>Extends</span>
        </div>
        <div class="legend-item">
            <div class="legend-line" style="background: #4ecdc4; border-bottom: 2px dashed #4ecdc4;"></div>
            <span>Implements</span>
        </div>
    </div>
    
    <div style="overflow: auto; height: calc(100vh - 100px); background: rgba(255,255,255,0.05);" id="diagram-scroll">
        <div class="diagram-container" id="diagram">
            <svg width="${maxX}" height="${maxY}" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1;">
                <defs>
                    <marker id="triangle-extends" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                        <polygon points="0,0 0,8 8,4" fill="#ff6b6b" />
                    </marker>
                    <marker id="triangle-implements" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                        <polygon points="0,0 0,8 8,4" fill="#4ecdc4" />
                    </marker>
                </defs>
                ${svgLines}
            </svg>
            ${folderBackgrounds}
            ${classBoxes}
        </div>
    </div>
    
    <script>
        let currentZoom = 1;
        
        function zoomIn() {
            currentZoom = Math.min(currentZoom + 0.2, 3);
            applyZoom();
        }
        
        function zoomOut() {
            currentZoom = Math.max(currentZoom - 0.2, 0.3);
            applyZoom();
        }
        
        function resetZoom() {
            currentZoom = 1;
            applyZoom();
        }
        
        function applyZoom() {
            const diagram = document.getElementById('diagram');
            diagram.style.transform = 'scale(' + currentZoom + ')';
        }
        
        function filterClasses(searchTerm) {
            const term = searchTerm.toLowerCase();
            const boxes = document.querySelectorAll('.uml-box');
            
            boxes.forEach(box => {
                const className = box.getAttribute('data-class');
                if (!term || className.toLowerCase().includes(term)) {
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            });
        }
    </script>
</body>
</html>`;
	}
}
