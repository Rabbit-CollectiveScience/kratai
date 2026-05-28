'use client';

import { useState, useEffect, useRef } from 'react';

interface DynamicViewProps {
  selectedMethod: string | null;
  onMethodSelect: (method: string | null) => void;
  syncEnabled: boolean;
}

// Hardcoded sequence diagram for ProjectDashboard.handleCreate() 
const createProjectSequenceDiagram = `sequenceDiagram
    participant UI as ProjectDashboard<br/>(Layer 1: UI)
    participant UC as CreateProjectUseCase<br/>(Layer 2: Controller)
    participant Model as ProjectModel<br/>(Layer 3: Domain)
    participant Repo as IProjectRepository<br/>(Layer 3: Interface)
    participant Mongo as MongoProjectRepository<br/>(Layer 4: Infrastructure)
    participant DB as MongoDB

    Note over UI: User clicks "Create Project"
    UI->>+UC: execute(projectData)
    Note over UC: Validate input
    UC->>+Model: new ProjectModel(data)
    Model->>Model: validate()
    alt validation fails
        Model-->>UC: ValidationError
        UC-->>UI: Error response
    else validation succeeds
        Model-->>-UC: valid ProjectModel
        UC->>+Repo: create(projectModel)
        Note over Repo: Interface contract
        Repo->>+Mongo: create(projectModel)
        Mongo->>Mongo: toDocument()
        Mongo->>+DB: insertOne(document)
        DB-->>-Mongo: {_id, ...}
        Mongo->>Mongo: toDomain(document)
        Mongo-->>-Repo: ProjectModel
        Repo-->>-UC: ProjectModel
        UC-->>-UI: Success + ProjectModel
        Note over UI: Update UI & redirect
    end`;

export default function DynamicView({ selectedMethod, onMethodSelect, syncEnabled }: DynamicViewProps) {
  const [renderedSvg, setRenderedSvg] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderSequenceDiagram = async () => {
      if (!selectedMethod || selectedMethod !== 'handleCreate') return;
      
      setIsRendering(true);
      
      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });
        
        const uniqueId = `sequence-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, createProjectSequenceDiagram);
        setRenderedSvg(svg);
      } catch (error) {
        console.error('Error rendering sequence diagram:', error);
      } finally {
        setIsRendering(false);
      }
    };

    renderSequenceDiagram();
  }, [selectedMethod]);

  return (
    <div className="w-[40%] bg-slate-900 flex flex-col">
      {/* Header with Tabs */}
      <div className="h-12 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-white font-semibold">Behavioral View</h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 bg-slate-700/50 text-white text-sm rounded-lg">
            Sequence
          </button>
          <button className="px-3 py-1.5 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-700/30">
            Flow
          </button>
          <button className="px-3 py-1.5 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-700/30">
            Timeline
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1 block">Select Method</label>
            <select 
              value={selectedMethod || ''}
              onChange={(e) => onMethodSelect(e.target.value || null)}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            >
              <option value="">No method selected</option>
              <option value="handleCreate">ProjectDashboard.handleCreate()</option>
            </select>
          </div>
          {selectedMethod && (
            <button
              onClick={() => onMethodSelect(null)}
              className="ml-3 p-2 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition-colors"
              title="Clear selection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="flex-1 overflow-auto">
        {selectedMethod === 'handleCreate' ? (
          <div className="w-full h-full p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">Sequence: Create Project Flow</h3>
              <p className="text-sm text-slate-400">Shows the execution flow when user creates a new project</p>
            </div>
            
            <div className="relative bg-slate-800/30 rounded-lg p-8">
              {isRendering && (
                <div className="absolute inset-0 bg-slate-800/30 rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm">Rendering sequence diagram...</p>
                  </div>
                </div>
              )}
              
              <div 
                ref={containerRef}
                className="sequence-diagram-container"
                dangerouslySetInnerHTML={{ __html: renderedSvg }}
                style={{
                  opacity: isRendering ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '20px',
                  minHeight: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700">
                <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-slate-300 font-medium mb-2">Sequence Diagram</h3>
              <p className="text-slate-500 text-sm max-w-md">
                Select a method from the dropdown above or click on handleCreate() in the ProjectDashboard class diagram to see its execution flow.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-700">
        <div className="text-xs">
          <div className="text-slate-400 font-medium mb-2">Method Info</div>
          <div className="space-y-1 text-slate-500">
            <div>No method selected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
