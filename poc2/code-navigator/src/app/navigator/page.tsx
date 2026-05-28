'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Explorer from '@/components/Explorer';
import StaticView from '@/components/StaticView';
import DynamicView from '@/components/DynamicView';
import TopBar from '@/components/TopBar';

export default function NavigatorPage() {
  const searchParams = useSearchParams();
  const projectName = searchParams.get('project') || 'aiboard';
  
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Top Navigation Bar */}
      <TopBar projectName={projectName} />

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Explorer */}
        <Explorer 
          syncEnabled={syncEnabled}
          onSyncToggle={setSyncEnabled}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />

        {/* Middle Panel: Structure View */}
        <StaticView 
          selectedFile={selectedFile}
          syncEnabled={syncEnabled}
          onFileSelect={setSelectedFile}
          onMethodSelect={setSelectedMethod}
        />

        {/* Right Panel: Behavioral View */}
        <DynamicView 
          selectedMethod={selectedMethod}
          onMethodSelect={setSelectedMethod}
          syncEnabled={syncEnabled}
        />
      </div>
    </div>
  );
}
