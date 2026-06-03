import { ReactFlowNode, ReactFlowEdge } from '../types/diagram';

export class ClassDiagramView {
	
	static generate(nodes: ReactFlowNode[], edges: ReactFlowEdge[], workspaceName: string): string {
		// For now, let's create a simple grid view that definitely works
		const nodesHtml = nodes.map(node => {
			const classInfo = node.data.classInfo;
			const borderColor = classInfo.isInterface ? '#4ecdc4' : classInfo.isAbstract ? '#ff6b6b' : '#667eea';
			const borderStyle = classInfo.isInterface ? 'dashed' : 'solid';
			
			return `
				<div style="
					background: white;
					border: 2px ${borderStyle} ${borderColor};
					border-radius: 12px;
					padding: 15px;
					box-shadow: 0 4px 12px rgba(0,0,0,0.1);
				">
					<div style="font-weight: bold; font-size: 1.1em; color: ${borderColor}; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #f0f0f0;">
						${classInfo.isInterface ? '<<interface>> ' : classInfo.isAbstract ? '<<abstract>> ' : ''}${classInfo.name}
					</div>
					${classInfo.properties.length > 0 ? `
						<div style="margin: 8px 0;">
							<div style="font-size: 0.75em; color: #999; text-transform: uppercase; margin-bottom: 4px; font-weight: 600;">Properties</div>
							${classInfo.properties.slice(0, 5).map(prop => `
								<div style="font-size: 0.85em; color: #333; padding: 2px 0; font-family: 'Courier New', monospace;">
									<span style="color: ${prop.visibility === 'private' ? '#e74c3c' : prop.visibility === 'protected' ? '#f39c12' : '#27ae60'};">
										${prop.visibility === 'private' ? '-' : prop.visibility === 'protected' ? '#' : '+'}
									</span>
									${prop.name}: ${prop.type}
								</div>
							`).join('')}
							${classInfo.properties.length > 5 ? `<div style="font-style: italic; color: #999; font-size: 0.85em;">... ${classInfo.properties.length - 5} more</div>` : ''}
						</div>
					` : ''}
					${classInfo.methods.length > 0 ? `
						<div style="margin: 8px 0;">
							<div style="font-size: 0.75em; color: #999; text-transform: uppercase; margin-bottom: 4px; font-weight: 600;">Methods</div>
							${classInfo.methods.slice(0, 5).map(method => `
								<div style="font-size: 0.85em; color: #333; padding: 2px 0; font-family: 'Courier New', monospace;">
									<span style="color: ${method.visibility === 'private' ? '#e74c3c' : method.visibility === 'protected' ? '#f39c12' : '#27ae60'};">
										${method.visibility === 'private' ? '-' : method.visibility === 'protected' ? '#' : '+'}
									</span>
									${method.name}()
								</div>
							`).join('')}
							${classInfo.methods.length > 5 ? `<div style="font-style: italic; color: #999; font-size: 0.85em;">... ${classInfo.methods.length - 5} more</div>` : ''}
						</div>
					` : ''}
					<div style="font-size: 0.75em; color: #999; margin-top: 8px; padding-top: 8px; border-top: 1px solid #f0f0f0;">
						${classInfo.filePath.replace(/^.*\/src\//, 'src/')}
					</div>
				</div>
			`;
		}).join('');

		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Class Diagram</title>
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
            z-index: 100;
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
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 30px;
            max-width: 1600px;
            margin: 0 auto;
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
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>📊 Class Diagram</h1>
            <p>${workspaceName} • ${nodes.length} classes found</p>
        </div>
        <div class="search-box">
            <input type="text" id="search" placeholder="Search classes..." oninput="filterClasses(this.value)">
        </div>
        <div class="stats">
            ${edges.length} relationships
        </div>
    </div>
    <div class="grid" id="grid">
        ${nodesHtml}
    </div>
    
    <script>
        const allNodes = ${JSON.stringify(nodes)};
        
        function filterClasses(searchTerm) {
            const grid = document.getElementById('grid');
            const term = searchTerm.toLowerCase();
            
            if (!term) {
                renderAll();
                return;
            }
            
            const filtered = allNodes.filter(node => 
                node.data.classInfo.name.toLowerCase().includes(term) ||
                node.data.classInfo.filePath.toLowerCase().includes(term)
            );
            
            grid.innerHTML = filtered.map(node => {
                const classInfo = node.data.classInfo;
                const borderColor = classInfo.isInterface ? '#4ecdc4' : classInfo.isAbstract ? '#ff6b6b' : '#667eea';
                const borderStyle = classInfo.isInterface ? 'dashed' : 'solid';
                
                return \`
                    <div style="
                        background: white;
                        border: 2px \${borderStyle} \${borderColor};
                        border-radius: 12px;
                        padding: 15px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    ">
                        <div style="font-weight: bold; font-size: 1.1em; color: \${borderColor}; margin-bottom: 10px;">
                            \${classInfo.name}
                        </div>
                        <div style="font-size: 0.85em; color: #666;">
                            Properties: \${classInfo.properties.length} | Methods: \${classInfo.methods.length}
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        function renderAll() {
            // Already rendered on page load
        }
    </script>
</body>
</html>`;
	}
}
