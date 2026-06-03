# MVP Architecture

## Overview

Clean, scalable architecture separating concerns into distinct layers for maintainability and extensibility.

## Structure

```
src/
├── extension.ts              # Entry point - registers commands only
├── commands/                 # Command handlers
│   ├── index.ts             # Exports all commands
│   └── showGitChanges.ts    # Git changes command
├── services/                 # Business logic
│   └── gitService.ts        # Git operations
├── views/                    # UI HTML generators
│   └── gitChangesView.ts   # Git changes webview
└── types/                    # TypeScript interfaces
    └── index.ts
```

## Layers

### 1. Extension Layer (`extension.ts`)
- **Responsibility**: Command registration only
- **Dependencies**: Commands
- **Role**: Entry point, activates extension, registers VS Code commands

### 2. Commands Layer (`commands/`)
- **Responsibility**: Handle command execution, orchestrate services
- **Dependencies**: Services, Views
- **Role**: Coordinate between VS Code API, services, and views

### 3. Services Layer (`services/`)
- **Responsibility**: Business logic and external integrations
- **Dependencies**: Types
- **Role**: Git operations, file analysis, data processing
- **Example**: `GitService` - all git operations (status, diff, fetch)

### 4. Views Layer (`views/`)
- **Responsibility**: Generate webview HTML
- **Dependencies**: Types
- **Role**: Pure presentation logic, no business rules

### 5. Types Layer (`types/`)
- **Responsibility**: Shared interfaces and types
- **Dependencies**: None
- **Role**: Type definitions used across all layers

## Principles

1. **Separation of Concerns** - Each layer has a single, well-defined purpose
2. **Dependency Direction** - Dependencies flow downward (Commands → Services → Types)
3. **Testability** - Each module can be unit tested independently
4. **Scalability** - Easy to add new commands without modifying existing code

## Adding New Features

### New Command
1. Create service in `services/` (if needed)
2. Create view in `views/` (if needed)
3. Create command handler in `commands/`
4. Export from `commands/index.ts`
5. Register in `extension.ts`

### Example Flow
```
User triggers command 
  → extension.ts (routes to command)
    → commands/myCommand.ts (orchestrates)
      → services/myService.ts (executes logic)
      → views/myView.ts (generates UI)
    → displays webview
```

## Benefits

- **Maintainable**: Easy to locate and modify code
- **Scalable**: Add features without touching existing code
- **Testable**: Mock services/views in command tests
- **Readable**: Clear structure, predictable file locations
