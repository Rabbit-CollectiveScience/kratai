'use client';

import { useState, useEffect, useRef } from 'react';
import { sequenceDiagrams } from '@/data/sequenceDiagrams';

// Mock code snippets for each method
const getCodeForMethod = (methodKey: string): string => {
  const [className, methodName] = methodKey.split('.');
  
  // Generate realistic code examples based on class and method
  if (className === 'ProjectDashboard') {
    if (methodName === 'render') {
      return `export default function ProjectDashboard() {
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = getCurrentUserId();
        const getProjectUseCase = new GetProjectUseCase(projectRepository);
        const result = await getProjectUseCase.execute(userId);
        setProjects(result);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="dashboard-container">
      <h1>My Projects</h1>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <Link href="/analytics">View Analytics</Link>
    </div>
  );
}`;
    } else if (methodName === 'handleCreate') {
      return `async function handleCreate(projectData: CreateProjectInput) {
  try {
    // Step 1: Validate input
    if (!projectData.name || !projectData.ownerId) {
      throw new ValidationError('Missing required fields');
    }
    
    // Step 2: Create project model
    const project = new ProjectModel({
      name: projectData.name,
      description: projectData.description,
      ownerId: projectData.ownerId,
      createdAt: new Date()
    });
    
    // Step 3: Validate model
    project.validate();
    
    // Step 4: Create GitHub repository (new feature)
    const githubRepo = await createGitHubRepo(projectData.name);
    project.githubRepo = githubRepo.url;
    
    // Step 5: Persist to database
    const useCase = new CreateProjectUseCase(projectRepository);
    const savedProject = await useCase.execute(project);
    
    // Step 6: Update UI
    router.push(\`/projects/\${savedProject.id}\`);
    
    return savedProject;
  } catch (error) {
    console.error('Project creation failed:', error);
    throw error;
  }
}`;
    }
  } else if (className === 'CreateProjectUseCase') {
    return `export class CreateProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}
  
  async execute(projectData: ProjectInput): Promise<ProjectModel> {
    // Layer 2: Use Case / Controller logic
    
    // Validate input
    if (!projectData.name) {
      throw new ValidationError('Project name is required');
    }
    
    // Create domain model
    const project = new ProjectModel({
      id: generateId(),
      name: projectData.name,
      description: projectData.description || '',
      ownerId: projectData.ownerId,
      githubRepo: projectData.githubRepo,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Validate domain rules
    project.validate();
    
    // Persist via repository (Layer 3 -> Layer 4)
    const savedProject = await this.projectRepo.create(project);
    
    return savedProject;
  }
}`;
  } else if (methodKey.includes('Agent')) {
    return `export class ${className} {
  constructor(private repo: IAgentRepository) {}
  
  async execute(input: AgentInput): Promise<AgentModel> {
    // Validate authorization
    if (!input.userId) {
      throw new UnauthorizedError('User not authenticated');
    }
    
    // Create or update agent model
    const agent = new AgentModel({
      ...input,
      updatedAt: new Date()
    });
    
    // Domain validation
    agent.validate();
    
    // Persist to MongoDB via repository
    const result = await this.repo.save(agent);
    
    return result;
  }
}`;
  }
  
  // Default fallback
  return `// ${className}.${methodName}()
// Source code not available for this method yet.
// This is a placeholder showing the method structure.

export class ${className} {
  async ${methodName}(input: any): Promise<any> {
    // Method implementation
    return {};
  }
}`;
};

interface DynamicViewProps {
  selectedMethod: string | null;
  onMethodSelect: (method: string | null) => void;
  syncEnabled: boolean;
}

export default function DynamicView({ selectedMethod, onMethodSelect }: DynamicViewProps) {
  const [renderedSvg, setRenderedSvg] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [activeView, setActiveView] = useState<'sequence' | 'code'>('sequence');
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDiagram = selectedMethod ? sequenceDiagrams[selectedMethod] : null;

  useEffect(() => {
    const renderSequenceDiagram = async () => {
      if (!currentDiagram) {
        setRenderedSvg('');
        return;
      }

      setIsRendering(true);

      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });

        const uniqueId = `sequence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, currentDiagram.code);
        setRenderedSvg(svg);
      } catch (error) {
        console.error('Error rendering sequence diagram:', error);
        setRenderedSvg('<div style="color: red; padding: 20px;">Failed to render diagram</div>');
      } finally {
        setIsRendering(false);
      }
    };

    renderSequenceDiagram();
  }, [currentDiagram]);

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

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setActiveView('sequence')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeView === 'sequence' 
                ? 'bg-slate-700/50 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            Sequence
          </button>
          <button 
            onClick={() => setActiveView('code')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeView === 'code' 
                ? 'bg-slate-700/50 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="flex-1 overflow-auto">
        {currentDiagram ? (
          <div className="w-full h-full p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{currentDiagram.title}</h3>
                <p className="text-sm text-slate-400">{currentDiagram.description}</p>
              </div>
              <button
                onClick={() => onMethodSelect(null)}
                className="ml-3 p-2 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition-colors"
                title="Clear selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {activeView === 'sequence' ? (
              <div className="relative bg-slate-800/30 rounded-lg p-8">
                {isRendering && (
                  <div className="absolute inset-0 bg-slate-800/30 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-slate-400 text-sm">Rendering sequence diagram...</p>
                    </div>
                  </div>
                )}

                <div
                  ref={containerRef}
                  className="sequence-diagram-container"
                  dangerouslySetInnerHTML={{ __html: renderedSvg }}
                  style={{
                    opacity: isRendering ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                    background: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    minHeight: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              </div>
            ) : (
              <div className="relative bg-slate-800/30 rounded-lg p-6">
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[calc(100vh-300px)]">
                  <pre className="text-green-400 whitespace-pre-wrap">
                    {getCodeForMethod(selectedMethod)}
                  </pre>
                </div>
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-300">
                    💡 <strong>Note:</strong> This is example code showing typical implementation patterns for this method.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700">
                <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-slate-300 font-medium mb-2">Sequence Diagram</h3>
              <p className="text-slate-500 text-sm max-w-md">
                Select a method from the dropdown above or click on any blue method in a yellow/green class to see its execution flow.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-700">
        <div className="text-xs">
          <div className="text-slate-400 font-medium mb-2">Method Info</div>
          <div className="space-y-1 text-slate-500">
            {selectedMethod ? (
              <>
                <div className="text-blue-400">{selectedMethod}()</div>
                <div className="text-slate-600">View: {activeView === 'sequence' ? 'Sequence Diagram' : 'Source Code'}</div>
              </>
            ) : (
              <div>No method selected</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
