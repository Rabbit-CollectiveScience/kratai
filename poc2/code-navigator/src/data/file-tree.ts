// File tree structure mirroring the actual aiboard project

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

export const aiboardFileTree: FileNode = {
  name: 'aiboard',
  type: 'folder',
  path: 'aiboard',
  children: [
    {
      name: 'src',
      type: 'folder',
      path: 'aiboard/src',
      children: [
        {
          name: '_layers',
          type: 'folder',
          path: 'aiboard/src/_layers',
          children: [
            { name: 'l1_ui', type: 'folder', path: 'aiboard/src/_layers/l1_ui', children: [] },
            { name: 'l2_controllers', type: 'folder', path: 'aiboard/src/_layers/l2_controllers', children: [] },
            { name: 'l3_model', type: 'folder', path: 'aiboard/src/_layers/l3_model', children: [] },
            { name: 'l4_infra', type: 'folder', path: 'aiboard/src/_layers/l4_infra', children: [] },
          ],
        },
        {
          name: 'app',
          type: 'folder',
          path: 'aiboard/src/app',
          children: [
            { name: 'globals.css', type: 'file', path: 'aiboard/src/app/globals.css' },
            { name: 'layout.tsx', type: 'file', path: 'aiboard/src/app/layout.tsx' },
            { name: 'page.tsx', type: 'file', path: 'aiboard/src/app/page.tsx' },
            { name: '(auth)', type: 'folder', path: 'aiboard/src/app/(auth)', children: [] },
            { name: '(dashboard)', type: 'folder', path: 'aiboard/src/app/(dashboard)', children: [] },
            { name: 'api', type: 'folder', path: 'aiboard/src/app/api', children: [] },
          ],
        },
        {
          name: 'l1_ui',
          type: 'folder',
          path: 'aiboard/src/l1_ui',
          children: [
            {
              name: 'components',
              type: 'folder',
              path: 'aiboard/src/l1_ui/components',
              children: [
                { name: 'AgentPickerModal.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/AgentPickerModal.tsx' },
                { name: 'ColumnModal.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/ColumnModal.tsx' },
                { name: 'CreateProjectModal.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/CreateProjectModal.tsx' },
                { name: 'FeedbackModal.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/FeedbackModal.tsx' },
                { name: 'FileTreePickerModal.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/FileTreePickerModal.tsx' },
                { name: 'Sidebar.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/Sidebar.tsx' },
                { name: 'SignOutButton.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/SignOutButton.tsx' },
                { name: 'Skeleton.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/Skeleton.tsx' },
                { name: 'TaskModal.tsx', type: 'file', path: 'aiboard/src/l1_ui/components/TaskModal.tsx' },
              ],
            },
            {
              name: 'constants',
              type: 'folder',
              path: 'aiboard/src/l1_ui/constants',
              children: [
                { name: 'task.ts', type: 'file', path: 'aiboard/src/l1_ui/constants/task.ts' },
              ],
            },
            {
              name: 'primitives',
              type: 'folder',
              path: 'aiboard/src/l1_ui/primitives',
              children: [
                { name: 'IconSelect.tsx', type: 'file', path: 'aiboard/src/l1_ui/primitives/IconSelect.tsx' },
                { name: 'LoadingButton.tsx', type: 'file', path: 'aiboard/src/l1_ui/primitives/LoadingButton.tsx' },
                { name: 'ModalShell.tsx', type: 'file', path: 'aiboard/src/l1_ui/primitives/ModalShell.tsx' },
              ],
            },
          ],
        },
        {
          name: 'l2_controllers',
          type: 'folder',
          path: 'aiboard/src/l2_controllers',
          children: [
            {
              name: 'agent',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/agent',
              children: [
                { name: 'CreateAgentUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/agent/CreateAgentUseCase.ts' },
                { name: 'CreateAgentUseCase.test.ts', type: 'file', path: 'aiboard/src/l2_controllers/agent/CreateAgentUseCase.test.ts' },
                { name: 'DeleteAgentUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/agent/DeleteAgentUseCase.ts' },
                { name: 'ListAgentsUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/agent/ListAgentsUseCase.ts' },
                { name: 'SetAgentContextFilesUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/agent/SetAgentContextFilesUseCase.ts' },
                { name: 'UpdateAgentUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/agent/UpdateAgentUseCase.ts' },
                { name: 'UploadAgentAvatarUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/agent/UploadAgentAvatarUseCase.ts' },
              ],
            },
            {
              name: 'auth',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/auth',
              children: [
                { name: 'InitiateGithubOAuthUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/auth/InitiateGithubOAuthUseCase.ts' },
                { name: 'RefreshGithubTokenUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/auth/RefreshGithubTokenUseCase.ts' },
                { name: 'SignInWithGithubUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/auth/SignInWithGithubUseCase.ts' },
                { name: 'SignOutUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/auth/SignOutUseCase.ts' },
              ],
            },
            {
              name: 'board',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/board',
              children: [
                { name: 'AddColumnUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/board/AddColumnUseCase.ts' },
                { name: 'DeleteColumnUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/board/DeleteColumnUseCase.ts' },
                { name: 'EditColumnUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/board/EditColumnUseCase.ts' },
                { name: 'GetBoardUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/board/GetBoardUseCase.ts' },
                { name: 'ReorderColumnsUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/board/ReorderColumnsUseCase.ts' },
              ],
            },
            {
              name: 'project',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/project',
              children: [
                { name: 'AddProjectMemberUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/AddProjectMemberUseCase.ts' },
                { name: 'CreateProjectUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/CreateProjectUseCase.ts' },
                { name: 'DeleteProjectUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/DeleteProjectUseCase.ts' },
                { name: 'GetProjectUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/GetProjectUseCase.ts' },
                { name: 'LeaveProjectUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/LeaveProjectUseCase.ts' },
                { name: 'ListGithubReposUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/ListGithubReposUseCase.ts' },
                { name: 'ListProjectsUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/ListProjectsUseCase.ts' },
                { name: 'RemoveProjectMemberUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/RemoveProjectMemberUseCase.ts' },
                { name: 'SetProjectAiContextUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/SetProjectAiContextUseCase.ts' },
                { name: 'UpdateProjectSettingsUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/project/UpdateProjectSettingsUseCase.ts' },
              ],
            },
            {
              name: 'prompt',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/prompt',
              children: [
                { name: 'CompileSessionPromptUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/prompt/CompileSessionPromptUseCase.ts' },
                { name: 'ScanRepoContextFilesUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/prompt/ScanRepoContextFilesUseCase.ts' },
              ],
            },
            {
              name: 'review',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/review',
              children: [
                { name: 'ApproveSessionUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/review/ApproveSessionUseCase.ts' },
                { name: 'GetLinkedPrUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/review/GetLinkedPrUseCase.ts' },
                { name: 'RejectSessionUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/review/RejectSessionUseCase.ts' },
                { name: 'RequestReworkUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/review/RequestReworkUseCase.ts' },
                { name: 'SubmitFeedbackAndContinueUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/review/SubmitFeedbackAndContinueUseCase.ts' },
              ],
            },
            {
              name: 'session',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/session',
              children: [
                { name: 'CancelSessionUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/CancelSessionUseCase.ts' },
                { name: 'DispatchAutonomousSessionUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/DispatchAutonomousSessionUseCase.ts' },
                { name: 'ExportCopilotPromptUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/ExportCopilotPromptUseCase.ts' },
                { name: 'ExportTaskUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/ExportTaskUseCase.ts' },
                { name: 'GetAiFleetStatusUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/GetAiFleetStatusUseCase.ts' },
                { name: 'GetAllProjectSessionsUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/GetAllProjectSessionsUseCase.ts' },
                { name: 'GetLiveSessionLogUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/GetLiveSessionLogUseCase.ts' },
                { name: 'GetSessionHistoryUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/GetSessionHistoryUseCase.ts' },
                { name: 'GetSessionReportUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/GetSessionReportUseCase.ts' },
                { name: 'GetSessionSummaryUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/GetSessionSummaryUseCase.ts' },
                { name: 'PickAgentForDispatchUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/session/PickAgentForDispatchUseCase.ts' },
              ],
            },
            {
              name: 'task',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/task',
              children: [
                { name: 'AssignWorkerUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/AssignWorkerUseCase.ts' },
                { name: 'CreateTaskUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/CreateTaskUseCase.ts' },
                { name: 'DeleteTaskUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/DeleteTaskUseCase.ts' },
                { name: 'GetTaskDetailUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/GetTaskDetailUseCase.ts' },
                { name: 'MoveTaskUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/MoveTaskUseCase.ts' },
                { name: 'ReorderTaskUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/ReorderTaskUseCase.ts' },
                { name: 'SetAcceptanceCriteriaUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/SetAcceptanceCriteriaUseCase.ts' },
                { name: 'SetTaskContextFilesUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/SetTaskContextFilesUseCase.ts' },
                { name: 'ToggleCriterionUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/ToggleCriterionUseCase.ts' },
                { name: 'UnassignWorkerUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/UnassignWorkerUseCase.ts' },
                { name: 'UpdateTaskUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/task/UpdateTaskUseCase.ts' },
              ],
            },
            {
              name: 'user',
              type: 'folder',
              path: 'aiboard/src/l2_controllers/user',
              children: [
                { name: 'GetCurrentUserUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/user/GetCurrentUserUseCase.ts' },
                { name: 'UpdateDisplayNameUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/user/UpdateDisplayNameUseCase.ts' },
                { name: 'UploadUserAvatarUseCase.ts', type: 'file', path: 'aiboard/src/l2_controllers/user/UploadUserAvatarUseCase.ts' },
              ],
            },
          ],
        },
        {
          name: 'l3_model',
          type: 'folder',
          path: 'aiboard/src/l3_model',
          children: [
            { name: 'AcceptanceCriterionModel.ts', type: 'file', path: 'aiboard/src/l3_model/AcceptanceCriterionModel.ts' },
            { name: 'AgentModel.ts', type: 'file', path: 'aiboard/src/l3_model/AgentModel.ts' },
            { name: 'ColumnModel.ts', type: 'file', path: 'aiboard/src/l3_model/ColumnModel.ts' },
            { name: 'index.ts', type: 'file', path: 'aiboard/src/l3_model/index.ts' },
            { name: 'ProjectModel.ts', type: 'file', path: 'aiboard/src/l3_model/ProjectModel.ts' },
            { name: 'SessionModel.ts', type: 'file', path: 'aiboard/src/l3_model/SessionModel.ts' },
            { name: 'TaskModel.ts', type: 'file', path: 'aiboard/src/l3_model/TaskModel.ts' },
            { name: 'UserModel.ts', type: 'file', path: 'aiboard/src/l3_model/UserModel.ts' },
            {
              name: 'repositories',
              type: 'folder',
              path: 'aiboard/src/l3_model/repositories',
              children: [
                { name: 'index.ts', type: 'file', path: 'aiboard/src/l3_model/repositories/index.ts' },
                { name: 'IAgentRepository.ts', type: 'file', path: 'aiboard/src/l3_model/repositories/IAgentRepository.ts' },
                { name: 'IProjectRepository.ts', type: 'file', path: 'aiboard/src/l3_model/repositories/IProjectRepository.ts' },
                { name: 'ISessionRepository.ts', type: 'file', path: 'aiboard/src/l3_model/repositories/ISessionRepository.ts' },
                { name: 'ITaskRepository.ts', type: 'file', path: 'aiboard/src/l3_model/repositories/ITaskRepository.ts' },
                { name: 'IUserRepository.ts', type: 'file', path: 'aiboard/src/l3_model/repositories/IUserRepository.ts' },
              ],
            },
          ],
        },
        {
          name: 'l4_infra',
          type: 'folder',
          path: 'aiboard/src/l4_infra',
          children: [
            { name: 'auth.config.ts', type: 'file', path: 'aiboard/src/l4_infra/auth.config.ts' },
            { name: 'auth.ts', type: 'file', path: 'aiboard/src/l4_infra/auth.ts' },
            { name: 'cloudrun.ts', type: 'file', path: 'aiboard/src/l4_infra/cloudrun.ts' },
            { name: 'db.ts', type: 'file', path: 'aiboard/src/l4_infra/db.ts' },
            { name: 'fileDb.ts', type: 'file', path: 'aiboard/src/l4_infra/fileDb.ts' },
            {
              name: 'github',
              type: 'folder',
              path: 'aiboard/src/l4_infra/github',
              children: [
                { name: 'GithubService.ts', type: 'file', path: 'aiboard/src/l4_infra/github/GithubService.ts' },
              ],
            },
            {
              name: 'strategies',
              type: 'folder',
              path: 'aiboard/src/l4_infra/strategies',
              children: [
                {
                  name: 'local',
                  type: 'folder',
                  path: 'aiboard/src/l4_infra/strategies/local',
                  children: [
                    { name: 'LocalProjectRepository.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/local/LocalProjectRepository.ts' },
                    { name: 'LocalSessionRepository.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/local/LocalSessionRepository.ts' },
                    { name: 'LocalTaskRepository.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/local/LocalTaskRepository.ts' },
                    { name: 'LocalUserRepository.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/local/LocalUserRepository.ts' },
                  ],
                },
                {
                  name: 'mongodb',
                  type: 'folder',
                  path: 'aiboard/src/l4_infra/strategies/mongodb',
                  children: [
                    { name: 'mongoClient.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/mongodb/mongoClient.ts' },
                    { name: 'MongoProjectRepository.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/mongodb/MongoProjectRepository.ts' },
                    { name: 'MongoSessionRepository.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/mongodb/MongoSessionRepository.ts' },
                    { name: 'MongoTaskRepository.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/mongodb/MongoTaskRepository.ts' },
                    { name: 'MongoUserRepository.ts', type: 'file', path: 'aiboard/src/l4_infra/strategies/mongodb/MongoUserRepository.ts' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'lib',
          type: 'folder',
          path: 'aiboard/src/lib',
          children: [
            { name: 'config.ts', type: 'file', path: 'aiboard/src/lib/config.ts' },
            { name: 'types.ts', type: 'file', path: 'aiboard/src/lib/types.ts' },
          ],
        },
        { name: 'middleware.ts', type: 'file', path: 'aiboard/src/middleware.ts' },
        { name: 'vitest.setup.ts', type: 'file', path: 'aiboard/src/vitest.setup.ts' },
      ],
    },
    {
      name: 'agent-runner',
      type: 'folder',
      path: 'aiboard/agent-runner',
      children: [
        {
          name: 'src',
          type: 'folder',
          path: 'aiboard/agent-runner/src',
          children: [
            {
              name: 'l1_execution',
              type: 'folder',
              path: 'aiboard/agent-runner/src/l1_execution',
              children: [
                { name: 'main.ts', type: 'file', path: 'aiboard/agent-runner/src/l1_execution/main.ts' },
                { name: 'PlannerAgent.ts', type: 'file', path: 'aiboard/agent-runner/src/l1_execution/PlannerAgent.ts' },
              ],
            },
            {
              name: 'l2_application',
              type: 'folder',
              path: 'aiboard/agent-runner/src/l2_application',
              children: [
                { name: 'CoderAgent.ts', type: 'file', path: 'aiboard/agent-runner/src/l2_application/CoderAgent.ts' },
                { name: 'PlannerLogic.ts', type: 'file', path: 'aiboard/agent-runner/src/l2_application/PlannerLogic.ts' },
              ],
            },
            {
              name: 'l3_infrastructure',
              type: 'folder',
              path: 'aiboard/agent-runner/src/l3_infrastructure',
              children: [
                { name: 'AiderClient.ts', type: 'file', path: 'aiboard/agent-runner/src/l3_infrastructure/AiderClient.ts' },
                { name: 'LLMClient.ts', type: 'file', path: 'aiboard/agent-runner/src/l3_infrastructure/LLMClient.ts' },
                { name: 'SystemConfig.ts', type: 'file', path: 'aiboard/agent-runner/src/l3_infrastructure/SystemConfig.ts' },
                { name: 'WorkspaceFileIO.ts', type: 'file', path: 'aiboard/agent-runner/src/l3_infrastructure/WorkspaceFileIO.ts' },
              ],
            },
            {
              name: 'l4_types',
              type: 'folder',
              path: 'aiboard/agent-runner/src/l4_types',
              children: [
                { name: 'AcceptanceCriterion.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/AcceptanceCriterion.ts' },
                { name: 'AcceptanceCriterionProgress.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/AcceptanceCriterionProgress.ts' },
                { name: 'AgentPrompt.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/AgentPrompt.ts' },
                { name: 'CancellationError.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/CancellationError.ts' },
                { name: 'CoderAssignment.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/CoderAssignment.ts' },
                { name: 'ExecutionResult.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/ExecutionResult.ts' },
                { name: 'GlobalProgressResult.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/GlobalProgressResult.ts' },
                { name: 'OracleAnswer.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/OracleAnswer.ts' },
                { name: 'ProgressPayload.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/ProgressPayload.ts' },
                { name: 'ProjectPrompt.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/ProjectPrompt.ts' },
                { name: 'Subtask.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/Subtask.ts' },
                { name: 'SubtaskPayload.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/SubtaskPayload.ts' },
                { name: 'TaskOverviewPayload.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/TaskOverviewPayload.ts' },
                { name: 'TaskPrompt.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/TaskPrompt.ts' },
                { name: 'VerificationResult.ts', type: 'file', path: 'aiboard/agent-runner/src/l4_types/VerificationResult.ts' },
              ],
            },
          ],
        },
        { name: 'tests', type: 'folder', path: 'aiboard/agent-runner/tests', children: [] },
        { name: 'package.json', type: 'file', path: 'aiboard/agent-runner/package.json' },
        { name: 'tsconfig.json', type: 'file', path: 'aiboard/agent-runner/tsconfig.json' },
      ],
    },
    {
      name: 'docs',
      type: 'folder',
      path: 'aiboard/docs',
      children: [
        { name: 'agent_api.md', type: 'file', path: 'aiboard/docs/agent_api.md' },
        { name: 'architecture.md', type: 'file', path: 'aiboard/docs/architecture.md' },
        { name: 'domain_model.md', type: 'file', path: 'aiboard/docs/domain_model.md' },
      ],
    },
    {
      name: 'public',
      type: 'folder',
      path: 'aiboard/public',
      children: [
        { name: 'agents', type: 'folder', path: 'aiboard/public/agents', children: [] },
      ],
    },
    { name: 'package.json', type: 'file', path: 'aiboard/package.json' },
    { name: 'tsconfig.json', type: 'file', path: 'aiboard/tsconfig.json' },
    { name: 'README.md', type: 'file', path: 'aiboard/README.md' },
  ],
};

// Helper to get file icon based on extension
export function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return '📘';
    case 'js':
    case 'jsx':
      return '📗';
    case 'json':
      return '📋';
    case 'md':
      return '📝';
    case 'css':
      return '🎨';
    default:
      return '📄';
  }
}
