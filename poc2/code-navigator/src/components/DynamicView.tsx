'use client';

import { useState, useEffect, useRef } from 'react';
import { sequenceDiagrams } from '@/data/sequenceDiagrams';

interface DynamicViewProps {
  selectedMethod: string | null;
  onMethodSelect: (method: string | null) => void;
  syncEnabled: boolean;
}

export default function DynamicView({ selectedMethod, onMethodSelect }: DynamicViewProps) {
  const [renderedSvg, setRenderedSvg] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDiagram = selectedMethod ? sequenceDiagrams[selectedMethod] : null;

  useEffect(() => {
    const renderSequenceDiagram = async () => {
      if (!currentDiagram) {
        setRenderedSvg('');
        return;
      }

      setIsRendering(true);

      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });

        const uniqueId = `sequence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, currentDiagram.code);
        setRenderedSvg(svg);
      } catch (error) {
        console.error('Error rendering sequence diagram:', error);
        setRenderedSvg('<div style="color: red; padding: 20px;">Failed to render diagram</div>');
      } finally {
        setIsRendering(false);
      }
    };

    renderSequenceDiagram();
  }, [currentDiagram]);

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

        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 bg-slate-700/50 text-white text-sm rounded-lg">Sequence</button>
          <button className="px-3 py-1.5 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-700/30">Flow</button>
          <button className="px-3 py-1.5 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-700/30">Timeline</button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="flex-1 overflow-auto">
        {currentDiagram ? (
          <div className="w-full h-full p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{currentDiagram.title}</h3>
                <p className="text-sm text-slate-400">{currentDiagram.description}</p>
              </div>
              <button
                onClick={() => onMethodSelect(null)}
                className="ml-3 p-2 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition-colors"
                title="Clear selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
                  justifyContent: 'center',
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
                Select a method from the dropdown above or click on any blue method in a yellow/green class to see its execution flow.
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
            {selectedMethod ? <div className="text-blue-400">{selectedMethod}()</div> : <div>No method selected</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
