'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  updated: string;
}

const mockProjects: Project[] = [
  {
    id: 'aiboard',
    name: 'aiboard',
    description: 'AI-powered task management platform with layered architecture',
    language: 'TypeScript',
    stars: 42,
    updated: '2 hours ago',
  },
  {
    id: 'api-gateway',
    name: 'api-gateway',
    description: 'Microservices API gateway with authentication and routing',
    language: 'TypeScript',
    stars: 28,
    updated: '1 day ago',
  },
  {
    id: 'data-pipeline',
    name: 'data-pipeline',
    description: 'ETL pipeline for processing large-scale data',
    language: 'Python',
    stars: 15,
    updated: '3 days ago',
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectProject = (projectId: string) => {
    setSelected(projectId);
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      router.push(`/navigator?project=${projectId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Code Navigator</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Select a Repository</h2>
          <p className="text-slate-400">Choose a project to explore its architecture and code structure</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search repositories..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleSelectProject(project.id)}
              disabled={loading}
              className={`w-full text-left p-6 rounded-xl border transition-all duration-200 ${
                selected === project.id
                  ? 'bg-blue-500/10 border-blue-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/70'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                    {selected === project.id && loading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    )}
                  </div>
                  <p className="text-slate-400 mb-3">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span>{project.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                      </svg>
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Updated {project.updated}</span>
                    </div>
                  </div>
                </div>
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
