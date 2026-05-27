'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface TopNavProps {
  isAuthenticated: boolean;
  selectedRepo: any | null;
  onLogout?: () => void;
}

export default function TopNav({ isAuthenticated, selectedRepo, onLogout }: TopNavProps) {
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null; // Don't show nav if not authenticated
  }

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Code Viz
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === '/' || pathname === ''
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {selectedRepo ? 'Code View' : 'Select Repo'}
            </Link>
            
            {selectedRepo && (
              <Link
                href="/c4"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === '/c4'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                C4 Architecture
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {selectedRepo && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedRepo.name}
                </span>
                <span className="mx-2">/</span>
                <span>{selectedRepo.owner.login}</span>
              </div>
            )}
            
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
