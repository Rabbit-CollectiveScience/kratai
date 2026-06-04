import { ReactFlowNode, ReactFlowEdge } from '../types/diagram';
import { FolderStructureBuilder } from './components/folderStructure';
import { HierarchicalLayoutCalculator, LayoutConfig } from './components/layoutCalculator';
import { ClassBoxRenderer } from './components/classBoxRenderer';
import { FolderBoxRenderer } from './components/folderBoxRenderer';
import { RelationshipRenderer } from './components/relationshipRenderer';

export class ClassDiagramView {
	
	static generate(nodes: ReactFlowNode[], edges: ReactFlowEdge[], workspaceName: string): string {
		// Step 1: Build folder structure
		const root = FolderStructureBuilder.build(nodes);
		console.log('=== Folder Structure ===');
		FolderStructureBuilder.logStructure(root);

		// Step 2: Configure layout
		const config: LayoutConfig = {
			boxWidth: 260,
			boxHeight: 180,
			classSpacing: 20,
			folderHeaderHeight: 40,
			folderPadding: 20,
			folderMargin: 25
		};

		// Step 3: Calculate layout
		const layoutCalc = new HierarchicalLayoutCalculator(config);
		const rootSize = layoutCalc.calculate(root, 40, 40);
		const { width: maxX, height: maxY } = layoutCalc.getCanvasSize(rootSize);

		// Step 4: Collect all computed positions/sizes
		const folderSizesMap = new Map<string, any>();
		const collectFolderSizes = (folder: any): void => {
			const size = layoutCalc.getFolderSize(folder.fullPath);
			if (size) folderSizesMap.set(folder.fullPath, size);
			folder.children.forEach((child: any) => collectFolderSizes(child));
		};
		collectFolderSizes(root);

		const classPositionsMap = new Map<string, any>();
		nodes.forEach(node => {
			const pos = layoutCalc.getClassPosition(node.data.classInfo.name);
			if (pos) classPositionsMap.set(node.data.classInfo.name, pos);
		});

		// Step 5: Render all components
		const classRenderer = new ClassBoxRenderer(config.boxWidth);
		const folderRenderer = new FolderBoxRenderer();
		const relationshipRenderer = new RelationshipRenderer(config.boxWidth, config.boxHeight);

		const classBoxes = nodes.map(node => {
			const pos = classPositionsMap.get(node.data.classInfo.name);
			return pos ? classRenderer.render(node.data.classInfo, pos) : '';
		}).join('');

		const folderBackgrounds = folderRenderer.renderAll(root, folderSizesMap);
		const svgLines = relationshipRenderer.renderAll(edges, classPositionsMap);
		const svgDefs = relationshipRenderer.renderMarkerDefs();

		const totalFolders = FolderStructureBuilder.countFolders(root);

		// Step 6: Generate final HTML
		return this.generateHTML(
			workspaceName,
			nodes.length,
			edges.length,
			totalFolders,
			maxX,
			maxY,
			folderBackgrounds,
			classBoxes,
			svgLines,
			svgDefs
		);
	}

	private static generateHTML(
		workspaceName: string,
		classCount: number,
		edgeCount: number,
		folderCount: number,
		maxX: number,
		maxY: number,
		folderBackgrounds: string,
		classBoxes: string,
		svgLines: string,
		svgDefs: string
	): string {
		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hierarchical Class Diagram</title>
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
            background: rgba(255, 255, 255, 0.03);
            border: 1px dashed rgba(255, 255, 255, 0.2);
            min-width: 800px;
            min-height: 600px;
        }
        .uml-box {
            transition: all 0.2s;
            cursor: pointer;
        }
        .uml-box:hover {
            transform: scale(1.05);
            z-index: 200 !important;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .folder-box {
            transition: opacity 0.2s;
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
            width: 100%;
        }
        .zoom-controls button:hover {
            background: #5568d3;
        }
        .zoom-controls button.debug {
            background: #ff6b6b;
            margin-top: 10px;
        }
        .zoom-controls button.debug:hover {
            background: #ee5a52;
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
            <h1>📊 Hierarchical Class Diagram</h1>
            <p>${workspaceName} • ${classCount} classes/modules • ${edgeCount} relationships</p>
        </div>
        <div class="search-box">
            <input type="text" id="search" placeholder="Search classes..." oninput="filterClasses(this.value)">
        </div>
        <div class="stats">
            ${folderCount} folders
        </div>
    </div>
    
    <div class="zoom-controls">
        <button onclick="zoomIn()">🔍 Zoom In</button>
        <button onclick="zoomOut()">🔍 Zoom Out</button>
        <button onclick="resetZoom()">↺ Reset</button>
        <button onclick="toggleDebug()" class="debug">🐛 Debug</button>
    </div>
    
    <div class="legend">
        <div style="font-weight: 600; margin-bottom: 8px;">Relationships</div>
        <div class="legend-item">
            <div class="legend-line" style="background: #ff6b6b;"></div>
            <span>Extends</span>
        </div>
        <div class="legend-item">
            <div class="legend-line" style="background: #4ecdc4; border-bottom: 2px dashed #4ecdc4; height: 0;"></div>
            <span>Implements</span>
        </div>
        <div class="legend-item">
            <div class="legend-line" style="background: #999; border-bottom: 1px dotted #999; height: 0;"></div>
            <span>Uses</span>
        </div>
    </div>
    
    <div style="overflow: auto; height: calc(100vh - 100px); background: rgba(255,255,255,0.05);" id="diagram-scroll">
        <div class="diagram-container" id="diagram">
            <svg width="${maxX}" height="${maxY}" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 50;">
                ${svgDefs}
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
        
        let debugMode = false;
        function toggleDebug() {
            debugMode = !debugMode;
            const folders = document.querySelectorAll('.folder-box');
            const boxes = document.querySelectorAll('.uml-box');
            
            if (debugMode) {
                folders.forEach(f => {
                    f.style.border = '3px solid red';
                    f.style.background = 'rgba(255, 0, 0, 0.1)';
                });
                boxes.forEach(b => {
                    b.style.outline = '2px solid lime';
                });
            } else {
                folders.forEach(f => {
                    f.style.border = '';
                    f.style.background = '';
                });
                boxes.forEach(b => {
                    b.style.outline = '';
                });
            }
        }
        
        // Log debug info on load
        window.addEventListener('load', function() {
            console.log('=== Class Diagram Debug Info ===');
            console.log('Total classes:', document.querySelectorAll('.uml-box').length);
            console.log('Total folders:', document.querySelectorAll('.folder-box').length);
            console.log('Canvas size:', '${maxX}x${maxY}');
            
            document.querySelectorAll('.uml-box').forEach((box, idx) => {
                const className = box.getAttribute('data-class');
                console.log(\`Class \${idx + 1}: \${className} at (\${box.style.left}, \${box.style.top})\`);
            });
        });
        
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
