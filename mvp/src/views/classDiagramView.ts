import { ReactFlowNode, ReactFlowEdge } from '../types/diagram';
import { FolderStructureBuilder } from './components/folderStructure';
import { FolderBoxRenderer } from './components/folderBoxRenderer';

export class ClassDiagramView {
	
	static generate(nodes: ReactFlowNode[], edges: ReactFlowEdge[], workspaceName: string): string {
		// Step 1: Build folder structure
		const root = FolderStructureBuilder.build(nodes);
		console.log('=== Folder Structure (CSS Grid Layout) ===');
		FolderStructureBuilder.logStructure(root);
		console.log(`\n📊 Total: ${nodes.length} classes, ${FolderStructureBuilder.countFolders(root)} folders`);

		// Step 2: Render with CSS Grid layout (no manual positioning!)
		const folderRenderer = new FolderBoxRenderer();
		const folderHTML = folderRenderer.renderAll(root);

		console.log(`\n✅ Generated HTML with CSS Grid layout`);
		console.log(`📝 All ${nodes.length} classes rendered in CSS Grid containers`);
		console.log(`⚠️  SVG relationships temporarily disabled (will re-add by reading DOM positions)`);
		
		// Step 3: Generate final HTML
		return this.generateHTML(
			workspaceName,
			nodes.length,
			edges.length,
			FolderStructureBuilder.countFolders(root),
			folderHTML
		);
	}

	private static generateHTML(
		workspaceName: string,
		classCount: number,
		edgeCount: number,
		folderCount: number,
		folderHTML: string
	): string {
		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hierarchical Class Diagram (CSS Grid)</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
        }
        .header {
            position: sticky;
            top: 0;
            background: white;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-bottom: 2px solid #333;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            margin: 0;
            font-size: 1.5em;
            color: #333;
            font-weight: 600;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 0.95em;
        }
        .stats {
            background: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 0.9em;
            font-weight: 500;
        }
        .diagram-container {
            padding: 20px;
            max-width: 100%;
            overflow-x: auto;
        }
        .uml-box {
            transition: all 0.2s;
            cursor: pointer;
        }
        .uml-box:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
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
            border: 2px solid #333;
            background: white;
            color: #333;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            width: 100%;
            font-weight: 500;
        }
        .zoom-controls button:hover {
            background: #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>📊 Hierarchical Class Diagram (CSS Grid)</h1>
            <p>${workspaceName} • ${classCount} classes • ${folderCount} folders</p>
        </div>
        <div class="stats">
            ${edgeCount} relationships (coming soon)
        </div>
    </div>
    
    <div class="zoom-controls">
        <button onclick="zoomIn()">🔍 Zoom In</button>
        <button onclick="zoomOut()">🔍 Zoom Out</button>
        <button onclick="resetZoom()">↺ Reset</button>
    </div>
    
    <div class="diagram-container" id="diagram">
        ${folderHTML}
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
            diagram.style.transformOrigin = 'top left';
        }
        
        // Log stats on load
        window.addEventListener('load', function() {
            console.log('=== CSS Grid Diagram Loaded ===');
            console.log('Total classes:', document.querySelectorAll('.uml-box').length);
            console.log('Total folders:', document.querySelectorAll('.folder-container').length);
            console.log('✅ All classes rendered via CSS Grid - no manual positioning!');
        });
    </script>
</body>
</html>`;
	}
}
