import { GitComparisonResult } from '../types';

export class GitChangesView {
	
	static generate(result: GitComparisonResult): string {
		const { workspaceName, currentBranch, compareTarget, changes } = result;
		
		const totalChanges = changes.length;
		const modified = changes.filter(c => c.status === 'modified').length;
		const added = changes.filter(c => c.status === 'added').length;
		const deleted = changes.filter(c => c.status === 'deleted').length;

		const totalAdditions = changes.reduce((sum, c) => sum + (c.additions || 0), 0);
		const totalDeletions = changes.reduce((sum, c) => sum + (c.deletions || 0), 0);

		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Git Changes</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }
        h1 {
            font-size: 2.5em;
            margin: 0 0 10px 0;
            text-align: center;
            font-weight: 700;
        }
        .workspace-name {
            text-align: center;
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        .branch-info {
            text-align: center;
            font-size: 0.95em;
            opacity: 0.8;
            margin-bottom: 30px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 30px 0;
        }
        .summary-card {
            background: rgba(255, 255, 255, 0.15);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
        }
        .summary-card .number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .summary-card .label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        .changes-list {
            margin-top: 30px;
        }
        .change-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px 20px;
            margin: 8px 0;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.2s, background 0.2s;
            border-left: 4px solid transparent;
        }
        .change-item:hover {
            transform: translateX(5px);
            background: rgba(255, 255, 255, 0.15);
        }
        .change-item.modified { border-left-color: #ffc107; }
        .change-item.added { border-left-color: #4caf50; }
        .change-item.deleted { border-left-color: #f44336; }
        .change-item.renamed { border-left-color: #2196f3; }
        .file-path {
            font-family: 'Courier New', monospace;
            font-size: 0.95em;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .file-stats {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .status-badge {
            background: rgba(255, 255, 255, 0.3);
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .stats-badge {
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        .additions { color: #4caf50; }
        .deletions { color: #f44336; }
        .emoji {
            font-size: 3em;
            text-align: center;
            margin-bottom: 20px;
        }
        .no-changes {
            text-align: center;
            padding: 60px 20px;
            opacity: 0.8;
            font-size: 1.2em;
        }
        .diff-summary {
            text-align: center;
            margin: 20px 0;
            font-size: 1.1em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🔄</div>
        <h1>Git Changes</h1>
        <div class="workspace-name">📁 ${workspaceName}</div>
        <div class="branch-info">Comparing: ${currentBranch} ← ${compareTarget}</div>
        
        ${totalChanges === 0 ? `
            <div class="no-changes">
                ✨ No changes detected!<br>
                Your local branch is up to date with the remote.
            </div>
        ` : `
            <div class="summary">
                <div class="summary-card">
                    <div class="number">${totalChanges}</div>
                    <div class="label">Total Changes</div>
                </div>
                <div class="summary-card">
                    <div class="number" style="color: #ffc107;">${modified}</div>
                    <div class="label">Modified</div>
                </div>
                <div class="summary-card">
                    <div class="number" style="color: #4caf50;">${added}</div>
                    <div class="label">Added</div>
                </div>
                <div class="summary-card">
                    <div class="number" style="color: #f44336;">${deleted}</div>
                    <div class="label">Deleted</div>
                </div>
            </div>
            
            <div class="diff-summary">
                <span class="additions">++${totalAdditions}</span> /
                <span class="deletions">--${totalDeletions}</span>
            </div>
            
            <div class="changes-list">
                <h2 style="text-align: center; margin-bottom: 20px;">Changed Files</h2>
                ${changes.map(change => `
                    <div class="change-item ${change.status}">
                        <div class="file-path">${change.path}</div>
                        <div class="file-stats">
                            ${change.additions !== undefined && change.deletions !== undefined ? `
                                <span class="stats-badge">
                                    <span class="additions">+${change.additions}</span>
                                    <span class="deletions">-${change.deletions}</span>
                                </span>
                            ` : ''}
                            <span class="status-badge">${change.status}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>
</body>
</html>`;
	}
}
