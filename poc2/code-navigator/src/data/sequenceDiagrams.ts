// Hardcoded sequence diagrams for methods in modified (yellow) and added (green) classes
// Key format: "ClassName.methodName" (without parentheses)

export const sequenceDiagrams: Record<string, { title: string; description: string; code: string }> = {
  // ============ ProjectDashboard (Yellow / Modified) ============
  'ProjectDashboard.render': {
    title: 'Render: ProjectDashboard',
    description: 'Mounts the dashboard component and loads project data',
    code: `sequenceDiagram
    participant UI as ProjectDashboard<br/>(Layer 1: UI)
    participant Hook as useEffect Hook
    participant UC as GetProjectUseCase<br/>(Layer 2)
    participant Repo as IProjectRepository<br/>(Layer 3)
    participant Mongo as MongoProjectRepository<br/>(Layer 4)
    participant DB as MongoDB

    UI->>UI: Component mount
    UI->>+Hook: useEffect runs
    Hook->>+UC: execute(userId)
    UC->>+Repo: findByUser(userId)
    Repo->>+Mongo: findByUser(userId)
    Mongo->>+DB: find({ ownerId })
    DB-->>-Mongo: project documents
    Mongo-->>-Repo: ProjectModel[]
    Repo-->>-UC: ProjectModel[]
    UC-->>-Hook: projects array
    Hook->>UI: setProjects(projects)
    UI->>UI: re-render with data
    Note over UI: Render project cards + analytics link`,
  },

  'ProjectDashboard.handleCreate': {
    title: 'Sequence: Create Project Flow',
    description: 'Shows the execution flow when user creates a new project',
    code: `sequenceDiagram
    participant UI as ProjectDashboard<br/>(Layer 1: UI)
    participant UC as CreateProjectUseCase<br/>(Layer 2: Controller)
    participant Model as ProjectModel<br/>(Layer 3: Domain)
    participant Repo as IProjectRepository<br/>(Layer 3: Interface)
    participant Mongo as MongoProjectRepository<br/>(Layer 4: Infrastructure)
    participant DB as MongoDB
    participant GitHub as GitHub API

    Note over UI: User clicks "Create Project"
    UI->>+UC: execute(projectData)
    
    rect rgba(255, 193, 7, 0.2)
        Note right of UC: MODIFIED: Enhanced validation
        UC->>UC: validateInput()
        UC->>UC: checkOwnerPermissions()
    end
    
    UC->>+Model: new ProjectModel(data)
    Model->>Model: validate()
    alt validation fails
        Model-->>UC: ValidationError
        UC-->>UI: Error response
    else validation succeeds
        Model-->>-UC: valid ProjectModel
        
        rect rgba(76, 175, 80, 0.2)
            Note right of UC: NEW: GitHub integration
            UC->>+GitHub: createRepository(name)
            GitHub-->>-UC: { repoUrl, ... }
            UC->>Model: setGitHubRepo(repoUrl)
        end
        
        UC->>+Repo: create(projectModel)
        Repo->>+Mongo: create(projectModel)
        
        rect rgba(255, 193, 7, 0.2)
            Note right of Mongo: MODIFIED: Added repo field
            Mongo->>Mongo: toDocument()
        end
        
        Mongo->>+DB: insertOne(document)
        DB-->>-Mongo: { _id, ... }
        Mongo->>Mongo: toDomain(document)
        Mongo-->>-Repo: ProjectModel
        Repo-->>-UC: ProjectModel
        UC-->>-UI: Success + ProjectModel
        Note over UI: Update UI & redirect
    end`,
  },

  // ============ AnalyticsDashboard (Green / Added) ============
  'AnalyticsDashboard.render': {
    title: 'Render: AnalyticsDashboard',
    description: 'New analytics dashboard component renders with metrics',
    code: `sequenceDiagram
    participant UI as AnalyticsDashboard<br/>(Layer 1: UI - NEW)
    participant Hook as useEffect Hook
    participant UC as ViewAnalyticsUseCase<br/>(Layer 2 - NEW)
    participant Repo as ISessionRepository<br/>(Layer 3)
    participant Mongo as MongoSessionRepository<br/>(Layer 4)
    participant DB as MongoDB

    rect rgba(76, 175, 80, 0.2)
        Note over UI,DB: NEW FEATURE: Analytics Dashboard
        UI->>UI: Component mount
        UI->>+Hook: useEffect runs
        Hook->>UI: setLoading(true)
        Hook->>+UC: execute(projectId)
        UC->>+Repo: findByProject(projectId)
        Repo->>+Mongo: findByProject(projectId)
        Mongo->>+DB: aggregate([...])
        DB-->>-Mongo: session metrics
        Mongo-->>-Repo: SessionModel[]
        Repo-->>-UC: SessionModel[]
        UC->>UC: computeMetrics(sessions)
        UC-->>-Hook: AnalyticsMetrics
        Hook->>UI: setMetrics(metrics)
        UI->>UI: re-render with charts
        Note over UI: Render metric cards + graphs
    end`,
  },

  'AnalyticsDashboard.fetchMetrics': {
    title: 'Fetch Analytics Metrics',
    description: 'On-demand refresh of analytics metrics',
    code: `sequenceDiagram
    participant UI as AnalyticsDashboard<br/>(Layer 1)
    participant UC as ViewAnalyticsUseCase<br/>(Layer 2)
    participant Repo as ISessionRepository<br/>(Layer 3)
    participant Mongo as MongoSessionRepository<br/>(Layer 4)
    participant DB as MongoDB

    Note over UI: User clicks Refresh
    UI->>UI: setRefreshing(true)
    UI->>+UC: execute(projectId, dateRange)
    UC->>+Repo: findByProject(projectId, dateRange)
    Repo->>+Mongo: findByProject(...)
    Mongo->>+DB: aggregate([$match, $group, $sort])
    DB-->>-Mongo: aggregated data
    Mongo-->>-Repo: SessionModel[]
    Repo-->>-UC: SessionModel[]
    UC->>UC: computeMetrics()
    UC->>UC: formatForCharts()
    UC-->>-UI: AnalyticsMetrics
    UI->>UI: setMetrics(metrics)
    UI->>UI: setRefreshing(false)`,
  },

  // ============ CreateProjectUseCase (Yellow / Modified) ============
  'CreateProjectUseCase.execute': {
    title: 'Execute: CreateProjectUseCase',
    description: 'Orchestrates project creation through the layers',
    code: `sequenceDiagram
    participant Caller as ProjectDashboard
    participant UC as CreateProjectUseCase<br/>(Layer 2)
    participant Model as ProjectModel<br/>(Layer 3)
    participant Repo as IProjectRepository<br/>(Layer 3)
    participant Impl as MongoProjectRepository<br/>(Layer 4)
    participant GitHub as GitHub API

    Caller->>+UC: execute(projectData)
    
    rect rgba(255, 193, 7, 0.2)
        Note right of UC: MODIFIED: Enhanced validation
        UC->>UC: validateInput()
    end
    
    UC->>+Model: new ProjectModel(data)
    Model->>Model: validate()
    Model-->>-UC: valid model
    
    rect rgba(76, 175, 80, 0.2)
        Note right of UC: NEW: GitHub repo creation
        UC->>+GitHub: createRepository(name)
        GitHub-->>-UC: { repoUrl }
        UC->>Model: setGitHubRepo(repoUrl)
    end
    
    rect rgba(244, 67, 54, 0.2)
        Note right of UC: REMOVED: Old cache update
        UC->>UC: ~~updateLocalCache()~~
    end
    
    UC->>+Repo: create(modelWithRepo)
    Repo->>+Impl: create(modelWithRepo)
    Impl-->>-Repo: persisted model
    Repo-->>-UC: persisted model
    UC-->>-Caller: ProjectModel`,
  },

  // ============ ViewAnalyticsUseCase (Green / Added) ============
  'ViewAnalyticsUseCase.execute': {
    title: 'Execute: ViewAnalyticsUseCase',
    description: 'NEW use case for computing analytics from sessions',
    code: `sequenceDiagram
    participant Caller as AnalyticsDashboard
    participant UC as ViewAnalyticsUseCase<br/>(Layer 2 - NEW)
    participant Repo as ISessionRepository<br/>(Layer 3)
    participant Impl as MongoSessionRepository<br/>(Layer 4)

    rect rgba(76, 175, 80, 0.2)
        Note over Caller,Impl: NEW FEATURE: Analytics Use Case
        Caller->>+UC: execute(projectId, dateRange?)
        UC->>+Repo: findByProject(projectId, dateRange)
        Repo->>+Impl: findByProject(...)
        Impl-->>-Repo: SessionModel[]
        Repo-->>-UC: SessionModel[]
        UC->>UC: groupByDay(sessions)
        UC->>UC: calculateSuccessRate()
        UC->>UC: calculateAverageDuration()
        UC->>UC: buildMetrics()
        UC-->>-Caller: AnalyticsMetrics
    end`,
  },

  // ============ ProjectModel (Yellow / Modified) ============
  'ProjectModel.validate': {
    title: 'Validate: ProjectModel',
    description: 'Domain validation logic for project entity',
    code: `sequenceDiagram
    participant Caller as CreateProjectUseCase
    participant Model as ProjectModel<br/>(Layer 3)
    participant Errors as ValidationErrors

    Caller->>+Model: validate()
    
    Model->>Model: check name not empty
    alt name invalid
        Model->>Errors: add("name required")
    end
    Model->>Model: check name length <= 100
    alt name too long
        Model->>Errors: add("name too long")
    end
    Model->>Model: check ownerId present
    alt no owner
        Model->>Errors: add("owner required")
    end
    
    rect rgba(255, 193, 7, 0.2)
        Note right of Model: MODIFIED: New GitHub validation
        Model->>Model: check githubRepo format
        alt invalid repo url
            Model->>Errors: add("invalid github url")
        end
    end
    
    alt has errors
        Model-->>Caller: throw ValidationError
    else valid
        Model-->>-Caller: void (success)
    end`,
  },

  // ============ IProjectRepository (Yellow / Modified - interface) ============
  'IProjectRepository.create': {
    title: 'Interface: IProjectRepository.create',
    description: 'Repository interface contract for creating projects',
    code: `sequenceDiagram
    participant Caller as CreateProjectUseCase
    participant Repo as IProjectRepository<br/>(Layer 3: Interface)
    participant Impl as MongoProjectRepository<br/>(Layer 4)

    Note over Repo: Interface contract - delegates to impl
    Caller->>+Repo: create(project: ProjectModel)
    Repo->>+Impl: create(project)
    Note over Impl: See MongoProjectRepository.create
    Impl-->>-Repo: ProjectModel (with _id)
    Repo-->>-Caller: ProjectModel (with _id)`,
  },

  'IProjectRepository.findById': {
    title: 'Interface: IProjectRepository.findById',
    description: 'Repository interface contract for fetching by ID',
    code: `sequenceDiagram
    participant Caller as GetProjectUseCase
    participant Repo as IProjectRepository<br/>(Layer 3: Interface)
    participant Impl as MongoProjectRepository<br/>(Layer 4)

    Caller->>+Repo: findById(id: string)
    Repo->>+Impl: findById(id)
    Note over Impl: See MongoProjectRepository.findById
    Impl-->>-Repo: ProjectModel | null
    Repo-->>-Caller: ProjectModel | null`,
  },

  // ============ MongoProjectRepository (Yellow / Modified) ============
  'MongoProjectRepository.create': {
    title: 'Mongo Repo: create',
    description: 'MongoDB-specific persistence of new project',
    code: `sequenceDiagram
    participant Caller as IProjectRepository
    participant Repo as MongoProjectRepository<br/>(Layer 4)
    participant Mapper as DocumentMapper
    participant Client as MongoClient
    participant DB as MongoDB

    Caller->>+Repo: create(project: ProjectModel)
    
    rect rgba(255, 193, 7, 0.2)
        Note right of Repo: MODIFIED: Map githubRepo field
        Repo->>+Mapper: toDocument(project)
        Mapper-->>-Repo: ProjectDocument (with githubRepo)
    end
    
    Repo->>+Client: db.projects.insertOne(doc)
    Client->>+DB: INSERT
    DB-->>-Client: { insertedId }
    Client-->>-Repo: InsertOneResult
    Repo->>+Mapper: toDomain({ ...doc, _id: insertedId })
    Mapper-->>-Repo: ProjectModel
    Repo-->>-Caller: ProjectModel`,
  },

  'MongoProjectRepository.findById': {
    title: 'Mongo Repo: findById',
    description: 'Fetch project document and map to domain model',
    code: `sequenceDiagram
    participant Caller as IProjectRepository
    participant Repo as MongoProjectRepository<br/>(Layer 4)
    participant Mapper as DocumentMapper
    participant Client as MongoClient
    participant DB as MongoDB

    Caller->>+Repo: findById(id: string)
    Repo->>Repo: validateObjectId(id)
    Repo->>+Client: db.projects.findOne({ _id })
    Client->>+DB: FIND
    DB-->>-Client: document | null
    Client-->>-Repo: document | null
    alt document is null
        Repo-->>Caller: null
    else found
        Repo->>+Mapper: toDomain(document)
        Mapper-->>-Repo: ProjectModel
        Repo-->>-Caller: ProjectModel
    end`,
  },
};

// List of methods that are clickable (have hardcoded sequence diagrams)
export const clickableMethods = Object.keys(sequenceDiagrams);
