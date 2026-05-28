// Diagram data with diff metadata for Code Navigator POC

export type DiffStatus = 'added' | 'modified' | 'deleted' | 'unchanged';

export interface DiagramElement {
  id: string;
  name: string;
  type: 'actor' | 'usecase' | 'system' | 'container' | 'component' | 'class';
  diff: {
    status: DiffStatus;
    description?: string;
  };
  path?: string; // Link to implementing code
}

export interface Diagram {
  id: string;
  level: 'usecase' | 'context' | 'container' | 'component' | 'class';
  title: string;
  description: string;
  mermaidCode: string;
  elements: DiagramElement[];
  changesSummary: {
    added: number;
    modified: number;
    deleted: number;
    unchanged: number;
  };
}

// ============================================================================
// Level 3: Class Diagram (Full Architecture)
// ============================================================================

export const classDiagram: Diagram = {
  id: 'level3-class',
  level: 'class',
  title: 'Class Diagram - 4-Layer Architecture',
  description: 'Shows all classes across UI, Controllers, Model, and Infrastructure layers',
  mermaidCode: `classDiagram
    %% Relationships
    ProjectDashboard ..> CreateProjectUseCase
    ProjectDashboard ..> GetProjectUseCase
    ProjectBoard ..> CreateTaskUseCase
    ProjectBoard ..> MoveTaskUseCase
    ProjectBoard ..> AddColumnUseCase
    AgentManagement ..> CreateAgentUseCase
    AgentManagement ..> ListAgentsUseCase
    AnalyticsDashboard ..> ViewAnalyticsUseCase
    
    CreateProjectUseCase ..> ProjectModel
    CreateProjectUseCase ..> IProjectRepository
    GetProjectUseCase ..> IProjectRepository
    CreateTaskUseCase ..> TaskModel
    CreateTaskUseCase ..> ITaskRepository
    MoveTaskUseCase ..> ITaskRepository
    AddColumnUseCase ..> ProjectModel
    AddColumnUseCase ..> IProjectRepository
    CreateAgentUseCase ..> AgentModel
    CreateAgentUseCase ..> IAgentRepository
    ListAgentsUseCase ..> IAgentRepository
    ViewAnalyticsUseCase ..> SessionModel
    ViewAnalyticsUseCase ..> ISessionRepository
    SignInWithGithubUseCase ..> UserModel
    SignInWithGithubUseCase ..> IUserRepository
    
    IProjectRepository <|.. MongoProjectRepository
    ITaskRepository <|.. MongoTaskRepository
    IAgentRepository <|.. MongoAgentRepository
    ISessionRepository <|.. MongoSessionRepository
    IUserRepository <|.. MongoUserRepository
    
    namespace Layer1_UI {
        class ProjectDashboard{
            +render()
            +handleCreate()
        }
        class ProjectBoard{
            +render()
            +handleMove()
        }
        class AgentManagement{
            +render()
            +handleCreate()
        }
        class AnalyticsDashboard{
            +render()
            +fetchMetrics()
        }
    }
    
    namespace Layer2_Controllers {
        class CreateProjectUseCase{
            -projectRepo
            +execute()
        }
        class GetProjectUseCase{
            -projectRepo
            +execute()
        }
        class CreateTaskUseCase{
            -taskRepo
            +execute()
        }
        class MoveTaskUseCase{
            -taskRepo
            +execute()
        }
        class AddColumnUseCase{
            -projectRepo
            +execute()
        }
        class CreateAgentUseCase{
            -agentRepo
            +execute()
        }
        class ListAgentsUseCase{
            -agentRepo
            +execute()
        }
        class ViewAnalyticsUseCase{
            -sessionRepo
            +execute()
        }
        class SignInWithGithubUseCase{
            -userRepo
            +execute()
        }
    }
    
    namespace Layer3_Domain {
        class ProjectModel{
            +id
            +name
            +githubRepo
            +validate()
        }
        class TaskModel{
            +id
            +title
            +status
            +validate()
        }
        class AgentModel{
            +id
            +name
            +avatar
            +validate()
        }
        class SessionModel{
            +id
            +taskId
            +status
        }
        class UserModel{
            +id
            +email
            +displayName
        }
        class ColumnModel{
            +id
            +name
            +order
        }
        class IProjectRepository{
            +create()*
            +findById()*
        }
        class ITaskRepository{
            +create()*
            +findById()*
        }
        class IAgentRepository{
            +create()*
            +findByProject()*
        }
        class ISessionRepository{
            +create()*
            +findByTask()*
        }
        class IUserRepository{
            +create()*
            +findById()*
        }
    }
    
    namespace Layer4_Infrastructure {
        class MongoProjectRepository{
            -client
            +create()
            +findById()
        }
        class MongoTaskRepository{
            -client
            +create()
        }
        class MongoAgentRepository{
            -client
            +create()
        }
        class MongoSessionRepository{
            -client
            +create()
        }
        class MongoUserRepository{
            -client
            +create()
        }
    }
    
    %% Styling
    class ProjectDashboard:::modified
    class AnalyticsDashboard:::added
    class CreateProjectUseCase:::modified
    class ViewAnalyticsUseCase:::added
    class ProjectModel:::modified
    class MongoProjectRepository:::modified
    
    classDef added fill:#22c55e,stroke:#16a34a,stroke-width:4px
    classDef modified fill:#eab308,stroke:#ca8a04,stroke-width:4px
    classDef unchanged fill:#e5e7eb,stroke:#9ca3af,stroke-width:2px`,
  elements: [
    // Added
    { id: 'AnalyticsDashboard', name: 'AnalyticsDashboard', type: 'class', diff: { status: 'added', description: 'NEW: Analytics dashboard' }, path: 'aiboard/src/l1_ui/pages/AnalyticsDashboard.tsx' },
    { id: 'ViewAnalyticsUseCase', name: 'ViewAnalyticsUseCase', type: 'class', diff: { status: 'added', description: 'NEW: Analytics use case' }, path: 'aiboard/src/l2_controllers/analytics/ViewAnalyticsUseCase.ts' },
    // Modified
    { id: 'ProjectDashboard', name: 'ProjectDashboard', type: 'class', diff: { status: 'modified', description: 'Added analytics link' }, path: 'aiboard/src/l1_ui/pages/ProjectDashboard.tsx' },
    { id: 'CreateProjectUseCase', name: 'CreateProjectUseCase', type: 'class', diff: { status: 'modified', description: 'Enhanced validation' }, path: 'aiboard/src/l2_controllers/project/CreateProjectUseCase.ts' },
    { id: 'ProjectModel', name: 'ProjectModel', type: 'class', diff: { status: 'modified', description: 'Added analytics metadata' }, path: 'aiboard/src/l3_model/ProjectModel.ts' },
    { id: 'MongoProjectRepository', name: 'MongoProjectRepository', type: 'class', diff: { status: 'modified', description: 'Updated schema' }, path: 'aiboard/src/l4_infra/strategies/mongodb/MongoProjectRepository.ts' },
    // Unchanged (sample)
    { id: 'ProjectBoard', name: 'ProjectBoard', type: 'class', diff: { status: 'unchanged' }, path: 'aiboard/src/l1_ui/pages/ProjectBoard.tsx' },
    { id: 'CreateTaskUseCase', name: 'CreateTaskUseCase', type: 'class', diff: { status: 'unchanged' }, path: 'aiboard/src/l2_controllers/task/CreateTaskUseCase.ts' },
  ],
  changesSummary: {
    added: 2,
    modified: 4,
    deleted: 0,
    unchanged: 24,
  },
};

// ============================================================================
// Level 2: Deployment Diagram (UML)
// ============================================================================

export const deploymentDiagram: Diagram = {
  id: 'level2-deployment',
  level: 'container',
  title: 'Deployment Diagram - aiboard Architecture',
  description: 'Shows where applications are deployed, databases, and external services',
  mermaidCode: `graph TB
    webapp["<b>Web Application</b><br/>━━━━━━━━━━━━━<br/>Next.js, Port 3000<br/>4-layer architecture"]
    
    agentrunner["<b>Agent Runner</b><br/>━━━━━━━━━━━━━<br/>Node.js Script<br/>Cloud Run"]
    
    webapp --> db
    agentrunner --> db
    
    db[("<b>MongoDB</b><br/>━━━━━━━<br/>Database")]
    
    db --> github
    db --> gcp
    db --> openai
    db --> aider
    
    github["<b>GitHub</b><br/>Repository & OAuth"]
    gcp["<b>Cloud Run</b><br/>Job Platform"]
    openai["<b>OpenAI API</b><br/>LLM Service"]
    aider["<b>Aider</b><br/>AI Pair Prog"]
    
    webapp -->|Dispatch<br/>Jobs| gcp
    webapp -->|OAuth<br/>Create PR| github
    gcp -.->|Execute| agentrunner
    agentrunner -->|LLM| openai
    agentrunner -->|Edit| aider
    agentrunner -->|Commit| github
    
    classDef platform fill:#3b82f6,stroke:#2563eb,stroke-width:4px,color:#fff,font-weight:bold
    classDef platformModified fill:#eab308,stroke:#ca8a04,stroke-width:4px,color:#000,font-weight:bold
    classDef database fill:#8b5cf6,stroke:#7c3aed,stroke-width:4px,color:#fff,font-weight:bold
    classDef databaseModified fill:#eab308,stroke:#ca8a04,stroke-width:4px,color:#000,font-weight:bold
    classDef external fill:#64748b,stroke:#475569,stroke-width:2px,color:#fff
    
    class webapp platformModified
    class agentrunner platform
    class db databaseModified
    class github,gcp,openai,aider external`,
  elements: [
    {
      id: 'webapp',
      name: 'Web Application',
      type: 'container',
      diff: { 
        status: 'modified',
        description: 'Added analytics dashboard and enhanced project creation'
      },
      path: 'aiboard/src',
    },
    {
      id: 'agentrunner',
      name: 'Agent Runner',
      type: 'container',
      diff: { status: 'unchanged' },
      path: 'aiboard/agent-runner',
    },
    {
      id: 'db',
      name: 'MongoDB Database',
      type: 'container',
      diff: { 
        status: 'modified',
        description: 'Added analytics collection'
      },
    },
    {
      id: 'github',
      name: 'GitHub',
      type: 'system',
      diff: { status: 'unchanged' },
    },
    {
      id: 'gcp',
      name: 'Cloud Run',
      type: 'system',
      diff: { status: 'unchanged' },
    },
    {
      id: 'openai',
      name: 'OpenAI API',
      type: 'system',
      diff: { status: 'unchanged' },
    },
    {
      id: 'aider',
      name: 'Aider',
      type: 'system',
      diff: { status: 'unchanged' },
    },
  ],
  changesSummary: {
    added: 0,
    modified: 2,
    deleted: 0,
    unchanged: 5,
  },
};

// ============================================================================
// Level 1: Use Case Diagram
// ============================================================================

export const useCaseDiagram: Diagram = {
  id: 'level1-usecase',
  level: 'usecase',
  title: 'Use Case Diagram - aiboard Platform',
  description: 'Shows who uses the system and what they can do',
  mermaidCode: `graph LR
    dev["👤 Developer"]
    agent["🤖 AI Agent"]
    lead["👔 Team Lead"]
    
    dev --> task
    dev --> agent_mgmt
    dev --> review
    agent --> execution
    lead --> project
    lead --> monitoring
    
    subgraph system["aiboard Platform"]
        direction TB
        
        subgraph task["Task Management"]
            direction TB
            uc1["Create Task"]
            uc2["Update Task"]
            uc3["Set Acceptance Criteria"]
            uc4["Set Task Context Files"]
            uc5["Move Task"]
        end
        
        subgraph agent_mgmt["Agent Management"]
            direction TB
            uc6["Create AI Agent"]
            uc7["Assign Agent to Task"]
            uc8["Configure Agent Context"]
        end
        
        subgraph monitoring["Monitoring"]
            direction TB
            uc9["Monitor Agent Progress"]
        end
        
        subgraph execution["Task Execution"]
            direction TB
            uc10["Execute Task Autonomously"]
            uc11["Generate Code Changes"]
            uc12["Create Branch & PR"]
        end
        
        subgraph review["Review & Approval"]
            direction TB
            uc13["Review AI Changes"]
            uc14["Approve Session"]
            uc15["Request Rework"]
            uc16["Provide Feedback"]
        end
        
        subgraph project["Project Management"]
            direction TB
            uc17["Create Project"]
            uc18["Manage Team Members"]
            uc19["View Analytics"]
        end
    end
    
    classDef added fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#000
    classDef modified fill:#eab308,stroke:#ca8a04,stroke-width:3px,color:#000
    classDef deleted fill:#ef4444,stroke:#dc2626,stroke-width:3px,color:#fff
    classDef unchanged fill:#e5e7eb,stroke:#9ca3af,stroke-width:2px,color:#000
    classDef actor fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    
    class uc19 added
    class uc17 modified
    class uc1,uc2,uc3,uc4,uc5,uc6,uc7,uc8,uc9,uc10,uc11,uc12,uc13,uc14,uc15,uc16,uc18 unchanged
    class dev,agent,lead actor`,
  elements: [
    // Actors
    {
      id: 'actor-dev',
      name: 'Developer',
      type: 'actor',
      diff: { status: 'unchanged' },
    },
    {
      id: 'actor-agent',
      name: 'AI Agent',
      type: 'actor',
      diff: { status: 'unchanged' },
    },
    {
      id: 'actor-lead',
      name: 'Team Lead',
      type: 'actor',
      diff: { status: 'unchanged' },
    },
    
    // Task Management Use Cases
    {
      id: 'uc1',
      name: 'Create Task',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/task/CreateTaskUseCase.ts',
    },
    {
      id: 'uc2',
      name: 'Update Task',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/task/UpdateTaskUseCase.ts',
    },
    {
      id: 'uc3',
      name: 'Set Acceptance Criteria',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/task/SetAcceptanceCriteriaUseCase.ts',
    },
    {
      id: 'uc4',
      name: 'Set Task Context Files',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/task/SetTaskContextFilesUseCase.ts',
    },
    {
      id: 'uc5',
      name: 'Move Task',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/task/MoveTaskUseCase.ts',
    },
    
    // Agent Management Use Cases
    {
      id: 'uc6',
      name: 'Create AI Agent',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/agent/CreateAgentUseCase.ts',
    },
    {
      id: 'uc7',
      name: 'Assign Agent to Task',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/task/AssignWorkerUseCase.ts',
    },
    {
      id: 'uc8',
      name: 'Configure Agent Context',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/agent/SetAgentContextFilesUseCase.ts',
    },
    {
      id: 'uc9',
      name: 'Monitor Agent Progress',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/session/GetSessionSummaryUseCase.ts',
    },
    
    // Execution Use Cases
    {
      id: 'uc10',
      name: 'Execute Task Autonomously',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/agent-runner/src/l1_execution/PlannerAgent.ts',
    },
    {
      id: 'uc11',
      name: 'Generate Code Changes',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/agent-runner/src/l2_application/CoderAgent.ts',
    },
    {
      id: 'uc12',
      name: 'Create Branch & PR',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l4_infra/github/GithubService.ts',
    },
    
    // Review Use Cases
    {
      id: 'uc13',
      name: 'Review AI Changes',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/review/ApproveSessionUseCase.ts',
    },
    {
      id: 'uc14',
      name: 'Approve Session',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/review/ApproveSessionUseCase.ts',
    },
    {
      id: 'uc15',
      name: 'Request Rework',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/review/RequestReworkUseCase.ts',
    },
    {
      id: 'uc16',
      name: 'Provide Feedback',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/review/SubmitFeedbackAndContinueUseCase.ts',
    },
    
    // Project Management Use Cases
    {
      id: 'uc17',
      name: 'Create Project',
      type: 'usecase',
      diff: { 
        status: 'modified',
        description: 'Enhanced project creation workflow'
      },
      path: 'aiboard/src/l2_controllers/project/CreateProjectUseCase.ts',
    },
    {
      id: 'uc18',
      name: 'Manage Team Members',
      type: 'usecase',
      diff: { status: 'unchanged' },
      path: 'aiboard/src/l2_controllers/project/AddProjectMemberUseCase.ts',
    },
    {
      id: 'uc19',
      name: 'View Analytics',
      type: 'usecase',
      diff: { 
        status: 'added',
        description: 'NEW: Analytics dashboard for project insights'
      },
      path: 'aiboard/src/l2_controllers/analytics/ViewAnalyticsUseCase.ts',
    },
  ],
  changesSummary: {
    added: 1,
    modified: 1,
    deleted: 0,
    unchanged: 17,
  },
};

// Export all diagrams
export const allDiagrams = {
  usecase: useCaseDiagram,
  deployment: deploymentDiagram,
  class: classDiagram,
};
