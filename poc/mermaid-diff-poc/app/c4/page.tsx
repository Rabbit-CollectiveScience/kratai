'use client';

import { useState } from 'react';
import MermaidDiagram from '@/components/MermaidDiagram';

export default function C4OverviewPage() {
  const [currentLevel, setCurrentLevel] = useState<'context' | 'container' | 'component'>('context');

  // Sample C4 diagrams for different levels
  const c4Context = `C4Context
    title System Context for Code Visualization Tool
    
    Person(dev, "Developer", "Views and analyzes code")
    System(app, "Code Viz App", "Visualizes code structure and relationships")
    System_Ext(github, "GitHub API", "Provides repository data")
    System_Ext(parser, "TypeScript Parser", "Analyzes code structure")
    
    Rel(dev, app, "Uses to visualize code")
    Rel(app, github, "Fetches code from")
    Rel(app, parser, "Parses code with")
  `;

  const c4Container = `C4Container
    title Container Diagram for Code Visualization
    
    Person(dev, "Developer")
    
    Container(web, "Web Application", "Next.js", "Provides UI for code visualization")
    Container(api, "API Layer", "Next.js API Routes", "Handles parsing and diagram generation")
    Container(parser, "Code Parser", "ts-morph", "Parses TypeScript/JavaScript code")
    ContainerDb(cache, "Cache", "In-Memory", "Stores parsed results")
    System_Ext(github, "GitHub API", "External")
    
    Rel(dev, web, "Uses")
    Rel(web, api, "Calls", "HTTPS")
    Rel(api, parser, "Uses")
    Rel(api, cache, "Reads/Writes")
    Rel(api, github, "Fetches from", "HTTPS")
  `;

  const c4Component = `C4Component
    title Component Diagram for Parser Module
    
    Container(api, "API Layer", "Next.js")
    
    Component(codeParser, "CodeParser", "TypeScript", "Parses code structure")
    Component(classExtractor, "ClassExtractor", "TypeScript", "Extracts class information")
    Component(methodAnalyzer, "MethodAnalyzer", "TypeScript", "Analyzes method calls")
    Component(diagramGen, "DiagramGenerator", "TypeScript", "Generates Mermaid diagrams")
    ComponentDb(ast, "AST Cache", "In-Memory", "Cached syntax trees")
    
    Rel(api, codeParser, "Uses")
    Rel(codeParser, classExtractor, "Uses")
    Rel(codeParser, methodAnalyzer, "Uses")
    Rel(classExtractor, diagramGen, "Provides data to")
    Rel(methodAnalyzer, diagramGen, "Provides data to")
    Rel(codeParser, ast, "Caches in")
  `;

  const diagrams = {
    context: c4Context,
    container: c4Container,
    component: c4Component,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            C4 Architecture Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Multi-level architecture visualization using C4 model
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCurrentLevel('context')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentLevel === 'context'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Level 1: Context
          </button>
          <button
            onClick={() => setCurrentLevel('container')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentLevel === 'container'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Level 2: Container
          </button>
          <button
            onClick={() => setCurrentLevel('component')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentLevel === 'component'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Level 3: Component
          </button>
        </div>

        {/* Diagram Display */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                {currentLevel === 'context' && 'System Context Diagram'}
                {currentLevel === 'container' && 'Container Diagram'}
                {currentLevel === 'component' && 'Component Diagram'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {currentLevel === 'context' && 'High-level view of the system and its external dependencies'}
                {currentLevel === 'container' && 'Major containers (applications, services) and their relationships'}
                {currentLevel === 'component' && 'Components within a container and their interactions'}
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 min-h-[600px]">
              <MermaidDiagram 
                chart={diagrams[currentLevel]}
              />
            </div>

            {/* Navigation hint */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Coming soon:</strong> Click on elements to zoom in and explore deeper levels. 
                Navigate from system overview down to individual classes and functions.
              </p>
            </div>
          </div>

          {/* Back to main view */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Code Visualization
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
