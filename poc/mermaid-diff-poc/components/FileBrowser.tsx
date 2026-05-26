'use client';

import { useState, useEffect } from 'react';
import { getGitHubService, GitHubFile, GitHubRepo } from '@/lib/github';

interface FileBrowserProps {
  repo: GitHubRepo;
  onSelectFile: (path: string, content: string) => void;
  onBack: () => void;
}

export default function FileBrowser({ repo, onSelectFile, onBack }: FileBrowserProps) {
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pathHistory, setPathHistory] = useState<string[]>(['']);

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  const loadFiles = async (path: string) => {
    setLoading(true);
    const github = getGitHubService();
    try {
      const data = await github.getRepoContents(
        repo.owner.login,
        repo.name,
        path
      );
      
      // Sort: directories first, then files alphabetically
      const sorted = data.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'dir' ? -1 : 1;
      });
      
      setFiles(sorted);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (file: GitHubFile) => {
    if (file.type === 'dir') {
      setPathHistory([...pathHistory, file.path]);
      setCurrentPath(file.path);
    } else {
      // Check if it's a code file we want to show
      const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go', '.rs'];
      const hasCodeExtension = codeExtensions.some(ext => file.name.endsWith(ext));
      
      if (hasCodeExtension) {
        try {
          setLoading(true);
          const github = getGitHubService();
          const content = await github.getFileContent(
            repo.owner.login,
            repo.name,
            file.path
          );
          onSelectFile(file.path, content);
        } catch (error) {
          console.error('Failed to load file content:', error);
          alert('Failed to load file content');
        } finally {
          setLoading(false);
        }
      } else {
        alert('Only code files (TypeScript, JavaScript, Python, etc.) are supported');
      }
    }
  };

  const handleGoBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = pathHistory.slice(0, -1);
      setPathHistory(newHistory);
      setCurrentPath(newHistory[newHistory.length - 1]);
    }
  };

  const getFileIcon = (file: GitHubFile) => {
    if (file.type === 'dir') {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    }
    
    // File icons based on extension
    if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      return <span className="text-blue-600 font-bold text-xs">TS</span>;
    }
    if (file.name.endsWith('.js') || file.name.endsWith('.jsx')) {
      return <span className="text-yellow-600 font-bold text-xs">JS</span>;
    }
    
    return (
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {repo.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {repo.owner.login}
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        {currentPath && (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                setPathHistory(['']);
                setCurrentPath('');
              }}
              className="text-blue-600 hover:underline"
            >
              root
            </button>
            {currentPath.split('/').map((part, idx, arr) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="text-slate-400">/</span>
                <span className="text-slate-600 dark:text-slate-300">{part}</span>
              </span>
            ))}
          </div>
        )}
        
        {pathHistory.length > 1 && (
          <button
            onClick={handleGoBack}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            ← Go back
          </button>
        )}
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-1">
            {files.map((file) => (
              <button
                key={file.sha}
                onClick={() => handleFileClick(file)}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <div className="flex-shrink-0 w-6 flex items-center justify-center">
                  {getFileIcon(file)}
                </div>
                <span className="flex-1 truncate text-sm text-slate-900 dark:text-white">
                  {file.name}
                </span>
                {file.type === 'dir' && (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
