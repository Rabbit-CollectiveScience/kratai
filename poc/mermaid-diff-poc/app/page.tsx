'use client';

import { useState, useEffect } from 'react';
import MermaidDiagram from '@/components/MermaidDiagram';
import GitHubAuth from '@/components/GitHubAuth';
import RepoSelector from '@/components/RepoSelector';
import FileBrowser from '@/components/FileBrowser';
import SequenceModal from '@/components/SequenceModal';
import TopNav from '@/components/TopNav';
import { getGitHubService, GitHubRepo } from '@/lib/github';

// Types for parsed code (matching codeParser types)
interface PropertyInfo {
  name: string;
  type: string;
  visibility: string;
}

interface MethodInfo {
  name: string;
  parameters: string[];
  returnType: string;
  visibility: string;
  body?: string;
}

interface ClassInfo {
  name: string;
  properties: PropertyInfo[];
  methods: MethodInfo[];
  extends?: string;
  implements?: string[];
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [parsedClasses, setParsedClasses] = useState<ClassInfo[]>([]);
  const [generatedClassDiagram, setGeneratedClassDiagram] = useState<string>('');
  const [currentClass, setCurrentClass] = useState<ClassInfo | null>(null);
  const [sequenceDiagram, setSequenceDiagram] = useState<string>('');
  const [loadingSequence, setLoadingSequence] = useState(false);

  // Check if already authenticated on mount and load selected repo
  useEffect(() => {
    const github = getGitHubService();
    if (github.isAuthenticated()) {
      setIsAuthenticated(true);
    }
    
    // Load selected repo from localStorage
    const repoData = localStorage.getItem('selected_repo');
    if (repoData) {
      try {
        setSelectedRepo(JSON.parse(repoData));
      } catch (error) {
        console.error('Failed to load repo from localStorage:', error);
      }
    }
  }, []);

  // Parse file when selected
  useEffect(() => {
    if (selectedFile) {
      const parseCode = async () => {
        try {
          const response = await fetch('/api/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: selectedFile.content,
              fileName: selectedFile.path,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to parse code');
          }

          const data = await response.json();
          setParsedClasses(data.classes || []);
          setGeneratedClassDiagram(data.classDiagram || '');
          setCurrentClass(data.classes && data.classes.length > 0 ? data.classes[0] : null);
          setSelectedMethod(null);
        } catch (error) {
          console.error('Failed to parse code:', error);
          setParsedClasses([]);
          setGeneratedClassDiagram('');
          setCurrentClass(null);
        }
      };

      parseCode();
    } else {
      setParsedClasses([]);
      setGeneratedClassDiagram('');
      setCurrentClass(null);
    }
  }, [selectedFile]);

  const handleAuthenticated = () => {
    const token = localStorage.getItem('github_token');
    if (token) {
      const github = getGitHubService();
      github.setToken(token);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    const github = getGitHubService();
    github.clearToken();
    setIsAuthenticated(false);
    setSelectedRepo(null);
    setSelectedFile(null);
    // Clear localStorage
    localStorage.removeItem('selected_repo');
  };

  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setSelectedFile(null);
    // Save to localStorage for persistence across pages
    localStorage.setItem('selected_repo', JSON.stringify(repo));
  };

  const handleSelectFile = (path: string, content: string) => {
    setSelectedFile({ path, content });
  };

  const handleBackToRepos = () => {
    setSelectedRepo(null);
    setSelectedFile(null);
    // Remove from localStorage
    localStorage.removeItem('selected_repo');
    setSelectedFile(null);
  };

  // Handle method click - generate sequence diagram from parsed method
  const handleMethodClick = (methodName: string) => {
    console.log('handleMethodClick called with:', methodName);
    setSelectedMethod(methodName);
  };

  // Load sequence diagram when method is selected
  useEffect(() => {
    if (selectedMethod) {
      console.log('[Client] Selected method:', selectedMethod);
      console.log('[Client] Current class:', currentClass?.name);
      console.log('[Client] Methods in class:', currentClass?.methods.length);
      
      if (currentClass) {
        // Extract just the method name (before the opening parenthesis)
        const methodNameOnly = selectedMethod.split('(')[0].replace(/^[+\-#]/, '').trim();
        console.log('[Client] Looking for method name:', methodNameOnly);
        
        const method = currentClass.methods.find(m => {
          const matches = m.name === methodNameOnly;
          console.log(`[Client] Checking method ${m.name}, body length: ${(m.body || '').length}, matches: ${matches}`);
          return matches;
        });
        
        if (method) {
          console.log('[Client] Found matching method:', method.name);
          console.log('[Client] Method body length:', (method.body || '').length);
          console.log('[Client] Method body preview:', (method.body || '').substring(0, 200));
        } else {
          console.log('[Client] No matching method found!');
          console.log('[Client] Available methods:', currentClass.methods.map(m => m.name).join(', '));
        }
      }
      
      setLoadingSequence(true);
      getSequenceDiagram(selectedMethod).then(diagram => {
        console.log('[Client] Sequence diagram generated, length:', diagram.length);
        setSequenceDiagram(diagram);
        setLoadingSequence(false);
      });
    } else {
      setSequenceDiagram('');
      setLoadingSequence(false);
    }
  }, [selectedMethod, currentClass]);

  // Get sequence diagram for clicked method - now from parsed code via API!
  const getSequenceDiagram = async (methodName: string): Promise<string> => {
    if (!currentClass) {
      return `sequenceDiagram
        Note over Client: No class selected`;
    }

    // Extract just the method name (strip visibility symbols and parameters)
    const methodNameOnly = methodName.split('(')[0].replace(/^[+\-#]/, '').trim();
    console.log('[Client getSequenceDiagram] Looking for:', methodNameOnly);

    // Find the method in the current class by name only
    const method = currentClass.methods.find(m => m.name === methodNameOnly);

    if (method) {
      console.log('[Client getSequenceDiagram] Found method, sending to API');
      try {
        // Generate sequence diagram from the actual parsed method via API
        const response = await fetch('/api/sequence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method,
            className: currentClass.name,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.sequenceDiagram;
        } else {
          console.error('[Client getSequenceDiagram] API error:', response.status);
        }
      } catch (error) {
        console.error('[Client getSequenceDiagram] Failed to generate sequence diagram:', error);
      }
    } else {
      console.log('[Client getSequenceDiagram] Method not found!');
      console.log('[Client getSequenceDiagram] Available:', currentClass.methods.map(m => m.name).join(', '));
    }

    // Default generic diagram
    return `sequenceDiagram
      participant Client
      participant ${currentClass.name}
      
      Client->>+${currentClass.name}: ${methodName}
      ${currentClass.name}->>${currentClass.name}: process
      ${currentClass.name}-->>-Client: result
      
      Note over Client,${currentClass.name}: Method implementation not available`;
  };

  // Debug: log when selectedMethod changes
  useEffect(() => {
    console.log('selectedMethod changed to:', selectedMethod);
    console.log('Modal should be:', selectedMethod !== null ? 'open' : 'closed');
  }, [selectedMethod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Top Navigation */}
      <TopNav 
        isAuthenticated={isAuthenticated}
        selectedRepo={selectedRepo}
        onLogout={handleLogout}
      />

      {/* Show authentication if not authenticated */}
      {!isAuthenticated && (
        <GitHubAuth onAuthenticated={handleAuthenticated} />
      )}

      {/* Show repo selector if authenticated but no repo selected */}
      {isAuthenticated && !selectedRepo && (
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Select a Repository
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Choose a repository to explore and visualize its code
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
            <RepoSelector onSelectRepo={handleSelectRepo} onLogout={handleLogout} />
          </div>
        </main>
      )}

      {/* Show file browser and diagram view when repo is selected */}
      {isAuthenticated && selectedRepo && (
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Code Visualization
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {selectedFile ? `Viewing: ${selectedFile.path}` : 'Select a file to visualize'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1900px] mx-auto">
            
            {/* Left Sidebar - File Browser */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 h-[calc(100vh-200px)] overflow-hidden">
              <FileBrowser
                repo={selectedRepo}
                onSelectFile={handleSelectFile}
                onBack={handleBackToRepos}
              />
            </div>

            {/* Middle - Class Diagram */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 h-[calc(100vh-200px)] overflow-auto">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  Class Diagram
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {selectedFile ? 'Click on methods to see sequence flows →' : 'Select a file from the left'}
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                {selectedFile ? (
                  <div>
                    {generatedClassDiagram ? (
                      <>
                        <div className="text-center py-2 text-green-600 dark:text-green-400 text-sm mb-4 flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          ✨ Generated from: {selectedFile.path.split('/').pop()}
                          {parsedClasses.length > 0 && <span className="text-xs text-slate-500">({parsedClasses.length} class{parsedClasses.length > 1 ? 'es' : ''} found)</span>}
                        </div>
                        <MermaidDiagram 
                          chart={generatedClassDiagram} 
                          className="flex justify-center"
                          onMethodClick={handleMethodClick}
                        />
                      </>
                    ) : (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-medium mb-1">No classes found</p>
                        <p className="text-sm">This file doesn't contain any class definitions</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="font-medium mb-2">Select a file to get started</p>
                    <p className="text-sm mb-4">Choose a TypeScript or JavaScript file from the left panel</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tip: For system overview, check out the C4 Architecture page above
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Sequence Diagram */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 h-[calc(100vh-200px)] overflow-auto">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    Sequence Diagram
                  </h2>
                  {selectedMethod ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Flow: <code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-600 dark:text-blue-400 font-mono text-xs">{selectedMethod}</code>
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Select a method
                    </p>
                  )}
                </div>
                {selectedMethod && (
                  <button
                    onClick={() => setSelectedMethod(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 min-h-[400px]">
                {loadingSequence ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="font-medium">Generating sequence diagram...</p>
                  </div>
                ) : selectedMethod && sequenceDiagram ? (
                  <MermaidDiagram 
                    chart={sequenceDiagram} 
                    className="flex justify-center"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                    </svg>
                    <p className="font-medium">Click a method</p>
                    <p className="text-sm mt-2">Methods are blue</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      )}
    </div>
  );
}
