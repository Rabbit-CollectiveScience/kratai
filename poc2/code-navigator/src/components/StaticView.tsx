'use client';

import { useState, useEffect } from 'react';
import { useCaseDiagram, deploymentDiagram, layersOverviewDiagram, classDiagram } from '@/data/diagrams';

interface StaticViewProps {
  selectedFile: string | null;
  syncEnabled: boolean;
  onFileSelect?: (file: string | null) => void;
}

// Map files to their classes for single-class diagrams
const fileToClassMap: Record<string, { className: string, layer: string, diff: string }> = {
  // Layer 1 - UI Components
  'aiboard/src/l1_ui/pages/ProjectDashboard.tsx': { className: 'ProjectDashboard', layer: 'Layer1_UI', diff: 'modified' },
  'aiboard/src/l1_ui/pages/AnalyticsDashboard.tsx': { className: 'AnalyticsDashboard', layer: 'Layer1_UI', diff: 'added' },
  'aiboard/src/l1_ui/pages/ProjectBoard.tsx': { className: 'ProjectBoard', layer: 'Layer1_UI', diff: 'unchanged' },
  'aiboard/src/l1_ui/pages/AgentManagement.tsx': { className: 'AgentManagement', layer: 'Layer1_UI', diff: 'unchanged' },
  
  // Layer 2 - Controllers/Use Cases
  'aiboard/src/l2_controllers/project/CreateProjectUseCase.ts': { className: 'CreateProjectUseCase', layer: 'Layer2_Controllers', diff: 'modified' },
  'aiboard/src/l2_controllers/project/GetProjectUseCase.ts': { className: 'GetProjectUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/task/CreateTaskUseCase.ts': { className: 'CreateTaskUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/task/MoveTaskUseCase.ts': { className: 'MoveTaskUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/project/AddColumnUseCase.ts': { className: 'AddColumnUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/agent/CreateAgentUseCase.ts': { className: 'CreateAgentUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/agent/DeleteAgentUseCase.ts': { className: 'DeleteAgentUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/agent/ListAgentsUseCase.ts': { className: 'ListAgentsUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/agent/SetAgentContextFilesUseCase.ts': { className: 'SetAgentContextFilesUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/agent/UpdateAgentUseCase.ts': { className: 'UpdateAgentUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/agent/UploadAgentAvatarUseCase.ts': { className: 'UploadAgentAvatarUseCase', layer: 'Layer2_Controllers', diff: 'unchanged' },
  'aiboard/src/l2_controllers/analytics/ViewAnalyticsUseCase.ts': { className: 'ViewAnalyticsUseCase', layer: 'Layer2_Controllers', diff: 'added' },
  
  // Layer 3 - Domain Models
  'aiboard/src/l3_model/ProjectModel.ts': { className: 'ProjectModel', layer: 'Layer3_Domain', diff: 'modified' },
  'aiboard/src/l3_model/TaskModel.ts': { className: 'TaskModel', layer: 'Layer3_Domain', diff: 'unchanged' },
  'aiboard/src/l3_model/AgentModel.ts': { className: 'AgentModel', layer: 'Layer3_Domain', diff: 'unchanged' },
  'aiboard/src/l3_model/SessionModel.ts': { className: 'SessionModel', layer: 'Layer3_Domain', diff: 'unchanged' },
  'aiboard/src/l3_model/IProjectRepository.ts': { className: 'IProjectRepository', layer: 'Layer3_Domain', diff: 'unchanged' },
  'aiboard/src/l3_model/ITaskRepository.ts': { className: 'ITaskRepository', layer: 'Layer3_Domain', diff: 'unchanged' },
  'aiboard/src/l3_model/IAgentRepository.ts': { className: 'IAgentRepository', layer: 'Layer3_Domain', diff: 'unchanged' },
  'aiboard/src/l3_model/ISessionRepository.ts': { className: 'ISessionRepository', layer: 'Layer3_Domain', diff: 'unchanged' },
  
  // Layer 4 - Infrastructure
  'aiboard/src/l4_infra/strategies/mongodb/MongoProjectRepository.ts': { className: 'MongoProjectRepository', layer: 'Layer4_Infrastructure', diff: 'modified' },
  'aiboard/src/l4_infra/strategies/mongodb/MongoTaskRepository.ts': { className: 'MongoTaskRepository', layer: 'Layer4_Infrastructure', diff: 'unchanged' },
  'aiboard/src/l4_infra/strategies/mongodb/MongoAgentRepository.ts': { className: 'MongoAgentRepository', layer: 'Layer4_Infrastructure', diff: 'unchanged' },
  'aiboard/src/l4_infra/strategies/mongodb/MongoSessionRepository.ts': { className: 'MongoSessionRepository', layer: 'Layer4_Infrastructure', diff: 'unchanged' },
};

function generateSingleClassDiagram(filePath: string): string | null {
  const classInfo = fileToClassMap[filePath];
  if (!classInfo) {
    return null;
  }

  const { className, layer, diff } = classInfo;
  let diagram = 'classDiagram\n';

  // Add the single class based on which layer it's in
  if (layer === 'Layer1_UI') {
    diagram += `    class ${className}{\n        +render()\n    }\n`;
  } else if (layer === 'Layer2_Controllers') {
    diagram += `    class ${className}{\n        -repo\n        +execute()\n    }\n`;
  } else if (layer === 'Layer3_Domain') {
    if (className.endsWith('Model')) {
      diagram += `    class ${className}{\n        +id\n        +name\n        +validate()\n    }\n`;
    } else {
      diagram += `    class ${className}{\n        +create()*\n        +findById()*\n    }\n`;
    }
  } else if (layer === 'Layer4_Infrastructure') {
    diagram += `    class ${className}{\n        -client\n        +create()\n    }\n`;
  }

  // Add styling based on diff status
  if (diff === 'added') {
    diagram += `    class ${className}:::added\n`;
  } else if (diff === 'modified') {
    diagram += `    class ${className}:::modified\n`;
  } else {
    diagram += `    class ${className}:::unchanged\n`;
  }

  diagram += `    
    classDef added fill:#22c55e,stroke:#16a34a,stroke-width:4px
    classDef modified fill:#eab308,stroke:#ca8a04,stroke-width:4px
    classDef unchanged fill:#e5e7eb,stroke:#9ca3af,stroke-width:2px`;

  return diagram;
}

export default function StaticView({ selectedFile, syncEnabled, onFileSelect }: StaticViewProps) {
  const [activeTab, setActiveTab] = useState<'usecase' | 'deployment' | 'layers' | 'class'>('usecase');
  const [mermaidRendered, setMermaidRendered] = useState(false);
  const [diagramKey, setDiagramKey] = useState(0);
  const [renderedSvg, setRenderedSvg] = useState<string>('');

  // Compute diagram and single class diagram BEFORE useEffect hooks
  const diagram = activeTab === 'deployment' ? deploymentDiagram : activeTab === 'layers' ? layersOverviewDiagram : activeTab === 'class' ? classDiagram : useCaseDiagram;
  const singleClassDiagram = selectedFile ? generateSingleClassDiagram(selectedFile) : null;
  const selectedClassName = selectedFile ? fileToClassMap[selectedFile]?.className : null;

  useEffect(() => {
    // Dynamically load and render Mermaid (client-side only)
    const renderMermaid = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });
        
        // Render the diagram directly to SVG
        const diagramCode = singleClassDiagram || diagram.mermaidCode;
        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const { svg } = await mermaid.render(uniqueId, diagramCode);
        setRenderedSvg(svg);
        setMermaidRendered(true);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        setMermaidRendered(true); // Still set to true to hide loading
      }
    };

    // Re-render when tab changes OR when file selection changes
    setMermaidRendered(false);
    setRenderedSvg('');
    setDiagramKey(prev => prev + 1); // Force remount
    setTimeout(renderMermaid, 100);
  }, [activeTab, selectedFile, singleClassDiagram, diagram.mermaidCode]);

  // Handle diagram click for drill-down navigation
  useEffect(() => {
    const handleDiagramClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const mermaidDiv = target.closest('.mermaid');
      
      if (mermaidDiv) {
        // Deployment → Package
        if (activeTab === 'deployment') {
          setActiveTab('layers');
        }
        // Package → Class
        else if (activeTab === 'layers') {
          setActiveTab('class');
        }
      }
    };

    document.addEventListener('click', handleDiagramClick);
    return () => document.removeEventListener('click', handleDiagramClick);
  }, [activeTab]);

  const { changesSummary } = diagram;

  return (
    <div className="flex-1 bg-slate-900 border-r border-slate-700 flex flex-col">
      {/* Header with Tabs */}
      <div className="h-12 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h2 className="text-white font-semibold">Structure View</h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveTab('usecase');
              onFileSelect?.(null);
            }}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'usecase'
                ? 'bg-slate-700/50 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            Use Cases
          </button>
          <button
            onClick={() => {
              setActiveTab('deployment');
              onFileSelect?.(null);
            }}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'deployment'
                ? 'bg-slate-700/50 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            Deployment
          </button>
          <button
            onClick={() => {
              setActiveTab('layers');
              onFileSelect?.(null);
            }}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'layers'
                ? 'bg-slate-700/50 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            Package
          </button>
          <button
            onClick={() => {
              setActiveTab('class');
              onFileSelect?.(null);
            }}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'class'
                ? 'bg-slate-700/50 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            Class
          </button>
        </div>
      </div>

      {/* Change Summary Bar */}
      {(activeTab === 'usecase' || activeTab === 'deployment' || activeTab === 'layers' || activeTab === 'class') && (
        <div className="px-4 py-2 bg-slate-800/30 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Changes:</span>
            <div className="flex items-center gap-1">
              <span className="text-green-500 font-semibold">+{changesSummary.added}</span>
              <span className="text-slate-500">added</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 font-semibold">~{changesSummary.modified}</span>
              <span className="text-slate-500">modified</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">{changesSummary.unchanged}</span>
              <span className="text-slate-500">unchanged</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {changesSummary.added + changesSummary.modified + changesSummary.deleted} {activeTab === 'deployment' ? 'components' : activeTab === 'layers' ? 'packages' : activeTab === 'class' ? 'classes' : 'use cases'} affected
          </div>
        </div>
      )}

      {/* Main Diagram Area */}
      <div className="flex-1 overflow-auto">
        {/* Selected File Class Diagram - ONLY show this when a class file is selected */}
        {singleClassDiagram ? (
          <div className="w-full h-full p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">Selected Class: {selectedClassName}</h3>
                  <p className="text-sm text-slate-400">{selectedFile}</p>
                </div>
                <button
                  onClick={() => onFileSelect?.(null)}
                  className="p-2 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition-colors"
                  title="Clear selection"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="relative bg-slate-800/30 rounded-lg p-8 min-h-[calc(100vh-300px)]">
              {/* Loading Overlay */}
              {!mermaidRendered && (
                <div className="absolute inset-0 bg-slate-800/30 rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm">Rendering diagram...</p>
                  </div>
                </div>
              )}
              
              <div 
                key={`single-${selectedFile}-${diagramKey}`}
                className="mermaid-container single-class-diagram"
                dangerouslySetInnerHTML={{ __html: renderedSvg }}
                style={{
                  opacity: mermaidRendered ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '20px'
                }}
              />
            </div>
            
            <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
              <h4 className="text-sm font-semibold text-white mb-3">Legend</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-slate-300">Added (New class)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-slate-300">Modified (Changed class)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-400"></div>
                  <span className="text-slate-300">Unchanged (Existing class)</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'usecase' || activeTab === 'deployment' || activeTab === 'layers' || activeTab === 'class' ? (
          <div className="w-full h-full p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">{diagram.title}</h3>
              <p className="text-sm text-slate-400">{diagram.description}</p>
            </div>
            
            <div className="relative bg-slate-800/30 rounded-lg p-8 min-h-[calc(100vh-300px)]">
              {/* Loading Overlay */}
              {!mermaidRendered && (
                <div className="absolute inset-0 bg-slate-800/30 rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm">Rendering diagram...</p>
                  </div>
                </div>
              )}
              
              {/* Mermaid Diagram - Rendered as SVG */}
              <div 
                key={diagramKey} 
                className={`mermaid-container main-diagram ${(activeTab === 'deployment' || activeTab === 'layers') ? 'cursor-pointer hover:opacity-90' : ''}`}
                title={activeTab === 'deployment' ? 'Click to view Package diagram' : activeTab === 'layers' ? 'Click to view Class diagram' : ''}
                dangerouslySetInnerHTML={{ __html: renderedSvg }}
                style={{
                  opacity: mermaidRendered ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '20px'
                }}
              />
              
              {/* Force text and line visibility for all diagrams */}
              <style jsx global>{`
                .main-diagram text,
                .single-class-diagram text {
                  fill: #000 !important;
                  font-size: 14px !important;
                }
                .main-diagram .classTitle,
                .single-class-diagram .classTitle {
                  fill: #000 !important;
                  font-weight: bold !important;
                }
                .main-diagram path,
                .single-class-diagram path,
                .main-diagram line,
                .single-class-diagram line {
                  stroke: #333 !important;
                  stroke-width: 2px !important;
                }
                .main-diagram .arrowheadPath,
                .single-class-diagram .arrowheadPath {
                  fill: #333 !important;
                }
                .main-diagram marker path,
                .single-class-diagram marker path {
                  fill: #333 !important;
                  stroke: #333 !important;
                }
              `}</style>
            </div>
            
            <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
              <h4 className="text-sm font-semibold text-white mb-3">Legend</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {activeTab === 'layers' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500"></div>
                      <span className="text-slate-300">Added (New component)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500"></div>
                      <span className="text-slate-300">Modified (Changed)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-400"></div>
                      <span className="text-slate-300">Unchanged (Existing)</span>
                    </div>
                  </>
                ) : activeTab === 'class' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500"></div>
                      <span className="text-slate-300">Added (New class)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500"></div>
                      <span className="text-slate-300">Modified (Changed class)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-400"></div>
                      <span className="text-slate-300">Unchanged (Existing class)</span>
                    </div>
                  </>
                ) : activeTab === 'deployment' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500"></div>
                      <span className="text-slate-300">Modified Component</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-500"></div>
                      <span className="text-slate-300">Unchanged Component</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-500"></div>
                      <span className="text-slate-300">External Service</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500"></div>
                      <span className="text-slate-300">Added (New functionality)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500"></div>
                      <span className="text-slate-300">Modified (Enhanced)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-400"></div>
                      <span className="text-slate-300">Unchanged (Existing)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-500"></div>
                      <span className="text-slate-300">Actor (User/System)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700">
                <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-slate-300 font-medium mb-2">Component Diagrams</h3>
              <p className="text-slate-500 text-sm max-w-md">
                Component diagrams showing code structure coming soon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="h-12 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <div className="h-4 w-px bg-slate-700"></div>
          <button className="px-2 py-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white text-xs transition-colors">
            Fit
          </button>
          <button className="px-2 py-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white text-xs transition-colors">
            Reset
          </button>
        </div>

        <div className="text-xs text-slate-500">
          {syncEnabled && <span className="text-green-500">● Synced</span>}
        </div>
      </div>
    </div>
  );
}
