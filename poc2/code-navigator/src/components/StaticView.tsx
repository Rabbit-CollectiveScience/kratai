'use client';

interface StaticViewProps {
  selectedFile: string | null;
  syncEnabled: boolean;
}

export default function StaticView({ selectedFile, syncEnabled }: StaticViewProps) {
  return (
    <div className="flex-1 bg-slate-900 border-r border-slate-700 flex flex-col">
      {/* Header with Tabs */}
      <div className="h-12 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h2 className="text-white font-semibold">Static View</h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 bg-slate-700/50 text-white text-sm rounded-lg">
            C4
          </button>
          <button className="px-3 py-1.5 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-700/30">
            Class
          </button>
          <button className="px-3 py-1.5 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-700/30">
            Dependencies
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700">
            <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-slate-300 font-medium mb-2">Architecture Diagram</h3>
          <p className="text-slate-500 text-sm max-w-md">
            C4 diagrams will appear here. Select an element in the explorer to navigate through different architectural levels.
          </p>
        </div>
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
