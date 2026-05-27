'use client';

interface ExplorerProps {
  syncEnabled: boolean;
  onSyncToggle: (enabled: boolean) => void;
  selectedFile: string | null;
  onFileSelect: (file: string) => void;
}

export default function Explorer({ syncEnabled, onSyncToggle, selectedFile, onFileSelect }: ExplorerProps) {
  return (
    <div className="w-80 bg-slate-800/50 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h2 className="text-white font-semibold">Explorer</h2>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        {/* Sync Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Sync Mode</span>
          <button
            onClick={() => onSyncToggle(!syncEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              syncEnabled ? 'bg-green-500' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                syncEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1 text-sm">
          {/* Folder: src */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-300 hover:bg-slate-700/50 rounded px-2 py-1 cursor-pointer">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>src</span>
            </div>

            {/* Nested folders */}
            <div className="ml-4 space-y-1">
              {/* l1_ui */}
              <div className="flex items-center gap-2 text-slate-400 hover:bg-slate-700/50 rounded px-2 py-1 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>l1_ui</span>
              </div>

              {/* l2_controllers */}
              <div className="flex items-center gap-2 text-slate-300 hover:bg-slate-700/50 rounded px-2 py-1 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>l2_controllers</span>
              </div>

              {/* l3_model */}
              <div className="flex items-center gap-2 text-slate-400 hover:bg-slate-700/50 rounded px-2 py-1 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>l3_model</span>
              </div>

              {/* l4_infra */}
              <div className="flex items-center gap-2 text-slate-400 hover:bg-slate-700/50 rounded px-2 py-1 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>l4_infra</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${syncEnabled ? 'bg-green-500' : 'bg-slate-500'}`}></div>
            <span className="text-slate-400 font-medium">CONTEXT</span>
          </div>
          <div className="space-y-1 text-slate-500 text-xs">
            <div>File: <span className="text-slate-300">-</span></div>
            <div>Method: <span className="text-slate-300">-</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
