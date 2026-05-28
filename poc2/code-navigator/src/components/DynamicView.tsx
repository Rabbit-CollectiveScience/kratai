'use client';

interface DynamicViewProps {
  selectedMethod: string | null;
  onMethodSelect: (method: string) => void;
  syncEnabled: boolean;
}

export default function DynamicView({ selectedMethod, onMethodSelect, syncEnabled }: DynamicViewProps) {
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
            <select className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50">
              <option>No method selected</option>
              <option>createUser()</option>
              <option>updateUser()</option>
              <option>deleteUser()</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700">
            <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-slate-300 font-medium mb-2">Sequence Diagram</h3>
          <p className="text-slate-500 text-sm max-w-md">
            Sequence diagrams will show execution flow here. Select a method from the dropdown or click on a method in the class diagram.
          </p>
        </div>
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
