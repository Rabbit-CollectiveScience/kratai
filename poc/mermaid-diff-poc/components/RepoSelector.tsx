'use client';

import { useState, useEffect } from 'react';
import { getGitHubService, GitHubRepo } from '@/lib/github';

interface RepoSelectorProps {
  onSelectRepo: (repo: GitHubRepo) => void;
  onLogout: () => void;
}

export default function RepoSelector({ onSelectRepo, onLogout }: RepoSelectorProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const github = getGitHubService();
    try {
      const [userData, reposData] = await Promise.all([
        github.getUser(),
        github.listRepos()
      ]);
      setUser(userData);
      setRepos(reposData);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to connect to GitHub. Please check your token.');
      onLogout();
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600 dark:text-slate-300">Loading repositories...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with user info */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {user?.name || user?.login}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {repos.length} repositories
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:border-slate-400 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
        />
      </div>

      {/* Repository list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredRepos.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No repositories found
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => onSelectRepo(repo)}
              className="w-full text-left p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {repo.name}
                    </h3>
                    {repo.private && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {repo.full_name}
                  </p>
                  {repo.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
