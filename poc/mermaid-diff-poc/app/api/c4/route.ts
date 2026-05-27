import { NextRequest, NextResponse } from 'next/server';

interface C4ContextRequest {
  owner: string;
  repo: string;
}

interface C4ContainerRequest {
  owner: string;
  repo: string;
  rootPath?: string;
}

interface C4ComponentRequest {
  owner: string;
  repo: string;
  folderPath: string;
}

// Analyze repository and generate C4 Context diagram
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level, owner, repo, folderPath } = body;

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (level === 'context') {
      const result = await generateContextDiagram(owner, repo, token);
      return NextResponse.json({ diagram: result.diagram, metadata: result.metadata });
    } else if (level === 'container') {
      const result = await generateContainerDiagram(owner, repo, token);
      return NextResponse.json({ diagram: result.diagram, metadata: result.metadata });
    } else if (level === 'component') {
      const result = await generateComponentDiagram(owner, repo, folderPath || '', token);
      return NextResponse.json({ diagram: result.diagram, metadata: result.metadata });
    }

    return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
  } catch (error) {
    console.error('[API /c4] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate C4 diagram', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function generateContextDiagram(owner: string, repo: string, token: string): Promise<{ diagram: string; metadata: any }> {
  try {
    // Hardcoded Context diagram for aiboard
    const diagram = `C4Context
    title System Context for Aider Architecture
    
    Person(dev, "Developer", "Develops and maintains the system")
    System(webapp, "Aider Web App", "Next.js web application with layered architecture")
    System_Ext(agentrunner, "Agent Runner", "Standalone GCP job for background processing")
    System_Ext(mongodb, "MongoDB", "Database for storing data")
    System_Ext(openai, "OpenAI API", "AI/LLM services")
    System_Ext(gcp, "Google Cloud Platform", "Cloud infrastructure")
    
    Rel(dev, webapp, "Uses and maintains")
    Rel(webapp, agentrunner, "Triggers jobs")
    Rel(webapp, mongodb, "Reads/Writes data")
    Rel(webapp, openai, "Calls AI services")
    Rel(agentrunner, gcp, "Runs on")
    Rel(agentrunner, mongodb, "Accesses data")
    `;

    return { diagram, metadata: { repoName: repo } };
  } catch (error) {
    console.error('Failed to generate context diagram:', error);
    return {
      diagram: `C4Context
      title System Context for ${repo}
      
      Person(dev, "Developer")
      System(app, "${repo}", "Application")
      
      Rel(dev, app, "Uses")
      
      UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")`,
      metadata: {}
    };
  }
}

async function generateContainerDiagram(owner: string, repo: string, token: string): Promise<{ diagram: string; metadata: any }> {
  try {
    // Hardcoded Container diagram for aiboard
    const diagram = `C4Container
    title Container Diagram for Aider Web Application
    
    Person(dev, "Developer")
    
    System_Boundary(sys, "Aider Web App") {
      Container(src, "Web Application", "Next.js", "Main application with layered architecture")
      Container(public, "Static Assets", "Files", "Images, fonts, and static resources")
    }
    
    Rel(dev, src, "Interacts with")
    Rel(src, public, "Serves static files from")
    `;

    return { 
      diagram, 
      metadata: { 
        folderMapping: { src: 'src', public: 'public' },
        folders: ['src', 'public']
      } 
    };
  } catch (error) {
    console.error('Failed to generate container diagram:', error);
    return {
      diagram: `C4Container
      title Container Diagram for ${repo}
      
      Person(dev, "Developer")
      System_Boundary(sys, "${repo}") {
        Container(app, "Application", "Code", "Main application code")
      }
      
      Rel(dev, app, "Uses")`,
      metadata: {}
    };
  }
}

async function generateComponentDiagram(owner: string, repo: string, folderPath: string, token: string): Promise<{ diagram: string; metadata: any }> {
  try {
    const folderName = folderPath.split('/').pop() || 'Module';

    // Hardcoded Component diagram showing layered architecture for src folder
    if (folderPath === 'src' || folderPath.endsWith('/src')) {
      const diagram = `C4Component
    title Layered Architecture - Source Code Structure
    
    Container_Boundary(container, "Web Application (src)") {
      Component(l1_ui, "Presentation Layer", "l1_ui", "React components, pages, UI logic")
      Component(l2_controllers, "Application Layer", "l2_controllers", "Business logic coordination, use cases")
      Component(l3_model, "Domain Layer", "l3_model", "Core business entities and domain logic")
      Component(l4_infra, "Infrastructure Layer", "l4_infra", "Database access, external services, utilities")
    }
    
    Rel(l1_ui, l2_controllers, "Calls")
    Rel(l2_controllers, l3_model, "Uses")
    Rel(l3_model, l4_infra, "Depends on")
    Rel(l2_controllers, l4_infra, "Calls directly")
    `;

      return {
        diagram,
        metadata: {
          fileMapping: {
            l1_ui: 'l1_ui',
            l2_controllers: 'l2_controllers',
            l3_model: 'l3_model',
            l4_infra: 'l4_infra'
          },
          folderPath: 'src',
          files: ['l1_ui', 'l2_controllers', 'l3_model', 'l4_infra'],
          isLayerView: true
        }
      };
    }

    // For public folder or other folders, show placeholder
    const diagram = `C4Component
      title Component Diagram for ${folderName}
      
      Container_Boundary(container, "${folderName}") {
        Component(placeholder, "Static Resources", "Assets", "Images, fonts, and other static files")
      }`;

    return {
      diagram,
      metadata: { fileMapping: {}, folderPath, files: [] }
    };
  } catch (error) {
    console.error('Failed to generate component diagram:', error);
    return {
      diagram: `C4Component
      title Component Diagram
      
      Container_Boundary(container, "Module") {
        Component(comp1, "Component", "Code", "Implementation")
      }`,
      metadata: {}
    };
  }
}

function getContainerDescription(folderName: string): string {
  const descriptions: Record<string, string> = {
    'src': 'Source code',
    'app': 'Application logic',
    'lib': 'Shared libraries',
    'components': 'UI components',
    'services': 'Business services',
    'api': 'API endpoints',
    'pages': 'Page components',
    'public': 'Static assets',
    'utils': 'Utility functions',
    'hooks': 'React hooks',
    'types': 'Type definitions',
    'styles': 'Styling',
  };
  return descriptions[folderName.toLowerCase()] || 'Module';
}

function getFileType(fileName: string): string {
  if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return 'React Component';
  if (fileName.endsWith('.ts')) return 'TypeScript';
  if (fileName.endsWith('.js')) return 'JavaScript';
  return 'Code';
}
