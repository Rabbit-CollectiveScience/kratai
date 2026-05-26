'use client';

import { useState, useEffect } from 'react';
import MermaidDiagram from '@/components/MermaidDiagram';
import GitHubAuth from '@/components/GitHubAuth';
import RepoSelector from '@/components/RepoSelector';
import FileBrowser from '@/components/FileBrowser';
import { getGitHubService, GitHubRepo } from '@/lib/github';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Check if already authenticated on mount
  useEffect(() => {
    const github = getGitHubService();
    if (github.isAuthenticated()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = () => {
    const token = localStorage.getItem('github_token');
    if (token) {
      const github = getGitHubService();
      github.setToken(token);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    const github = getGitHubService();
    github.clearToken();
    setIsAuthenticated(false);
    setSelectedRepo(null);
    setSelectedFile(null);
  };

  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setSelectedFile(null);
  };

  const handleSelectFile = (path: string, content: string) => {
    setSelectedFile({ path, content });
  };

  const handleBackToRepos = () => {
    setSelectedRepo(null);
    setSelectedFile(null);
  };

  // Handle method click
  const handleMethodClick = (methodName: string) => {
    console.log('handleMethodClick called with:', methodName);
    setSelectedMethod(methodName);
  };

  // Debug: log when selectedMethod changes
  useEffect(() => {
    console.log('selectedMethod changed to:', selectedMethod);
    console.log('Modal should be:', selectedMethod !== null ? 'open' : 'closed');
  }, [selectedMethod]);

  // Sample class diagram showing code structure (for demo before file is selected)
  const classDiagram = `classDiagram
    class UserService {
      +String userId
      +String email
      +createUser(data)
      +deleteUser(id)
      +updateUser(id, data)
      +getUserById(id)
    }
    
    class Database {
      +String connectionString
      +connect()
      +query(sql)
      +insert(table, data)
      +update(table, id, data)
      +delete(table, id)
    }
    
    class AuthService {
      +String secretKey
      +login(email, password)
      +logout(token)
      +validateToken(token)
      +refreshToken(token)
    }
    
    UserService --> Database : uses
    UserService --> AuthService : authenticates
    AuthService --> Database : stores tokens
  `;

  // Sequence diagrams for different methods
  const sequenceDiagrams: Record<string, string> = {
    'createUser(data)': `sequenceDiagram
      participant Client
      participant UserService
      participant AuthService
      participant Database
      
      Client->>+UserService: createUser(data)
      UserService->>+AuthService: validateToken(token)
      AuthService->>+Database: query("SELECT * FROM sessions")
      Database-->>-AuthService: session data
      AuthService-->>-UserService: token valid
      
      UserService->>UserService: validate user data
      UserService->>+Database: insert("users", data)
      Database-->>-UserService: new user id
      
      UserService->>+Database: insert("audit_log", action)
      Database-->>-UserService: log created
      
      UserService-->>-Client: user created successfully`,
    
    'deleteUser(id)': `sequenceDiagram
      participant Client
      participant UserService
      participant AuthService
      participant Database
      
      Client->>+UserService: deleteUser(id)
      UserService->>+AuthService: validateToken(token)
      AuthService-->>-UserService: token valid
      
      UserService->>+Database: query("SELECT * FROM users WHERE id=?", id)
      Database-->>-UserService: user data
      
      alt user exists
        UserService->>+Database: delete("users", id)
        Database-->>-UserService: deleted
        UserService->>+Database: insert("audit_log", "user_deleted")
        Database-->>-UserService: logged
        UserService-->>Client: user deleted
      else user not found
        UserService-->>Client: error: user not found
      end`,
    
    'login(email, password)': `sequenceDiagram
      participant Client
      participant AuthService
      participant Database
      
      Client->>+AuthService: login(email, password)
      AuthService->>+Database: query("SELECT * FROM users WHERE email=?")
      Database-->>-AuthService: user data
      
      alt user exists
        AuthService->>AuthService: verify password hash
        alt password valid
          AuthService->>AuthService: generate JWT token
          AuthService->>+Database: insert("sessions", token)
          Database-->>-AuthService: session created
          AuthService-->>Client: { token, user }
        else password invalid
          AuthService-->>Client: error: invalid credentials
        end
      else user not found
        AuthService-->>Client: error: user not found
      end`,
    
    'query(sql)': `sequenceDiagram
      participant Service
      participant Database
      participant ConnectionPool
      participant PostgreSQL
      
      Service->>+Database: query(sql)
      Database->>+ConnectionPool: getConnection()
      ConnectionPool-->>-Database: connection
      
      Database->>Database: sanitize SQL
      Database->>Database: prepare statement
      
      Database->>+PostgreSQL: execute query
      PostgreSQL->>PostgreSQL: parse SQL
      PostgreSQL->>PostgreSQL: execute query plan
      PostgreSQL-->>-Database: result set
      
      Database->>+ConnectionPool: releaseConnection()
      ConnectionPool-->>-Database: released
      
      Database-->>-Service: query results`,

    'validateToken(token)': `sequenceDiagram
      participant Service
      participant AuthService
      participant Database
      
      Service->>+AuthService: validateToken(token)
      AuthService->>AuthService: verify JWT signature
      
      alt signature valid
        AuthService->>AuthService: check expiration
        alt not expired
          AuthService->>+Database: query("SELECT * FROM sessions")
          Database-->>-AuthService: session data
          alt session exists
            AuthService-->>Service: token valid
          else session not found
            AuthService-->>Service: error: session expired
          end
        else token expired
          AuthService-->>Service: error: token expired
        end
      else signature invalid
        AuthService-->>Service: error: invalid token
      end`
  };

  // Get sequence diagram for clicked method
  const getSequenceDiagram = (methodName: string): string => {
    // Try exact match first
    if (sequenceDiagrams[methodName]) {
      return sequenceDiagrams[methodName];
    }
    
    // Default sequence diagram for methods without specific implementations
    return `sequenceDiagram
      participant Client
      participant Service
      participant Database
      
      Client->>+Service: ${methodName}
      Service->>Service: process request
      Service->>+Database: execute query
      Database-->>-Service: result
      Service-->>-Client: response
      
      Note over Client,Database: Sequence diagram for ${methodName}<br/>Click other methods to see their flows`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Show authentication if not authenticated */}
      {!isAuthenticated && (
        <GitHubAuth onAuthenticated={handleAuthenticated} />
      )}

      {/* Show repo selector if authenticated but no repo selected */}
      {isAuthenticated && !selectedRepo && (
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Select a Repository
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Choose a repository to explore and visualize its code
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
            <RepoSelector onSelectRepo={handleSelectRepo} onLogout={handleLogout} />
          </div>
        </main>
      )}

      {/* Show file browser and diagram view when repo is selected */}
      {isAuthenticated && selectedRepo && (
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Code Visualization
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {selectedFile ? `Viewing: ${selectedFile.path}` : 'Select a file to visualize'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1900px] mx-auto">
            
            {/* Left Sidebar - File Browser */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 h-[calc(100vh-200px)] overflow-hidden">
              <FileBrowser
                repo={selectedRepo}
                onSelectFile={handleSelectFile}
                onBack={handleBackToRepos}
              />
            </div>

            {/* Middle - Class Diagram */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 h-[calc(100vh-200px)] overflow-auto">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  Class Diagram
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {selectedFile ? 'Click on methods to see sequence flows →' : 'Select a file from the left'}
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                {selectedFile ? (
                  <div>
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm mb-4">
                      📄 {selectedFile.path.split('/').pop()} selected<br/>
                      <span className="text-xs">Phase 2 will parse this file and generate diagrams</span>
                    </div>
                    <MermaidDiagram 
                      chart={classDiagram} 
                      className="flex justify-center"
                      onMethodClick={handleMethodClick}
                    />
                  </div>
                ) : (
                  <MermaidDiagram 
                    chart={classDiagram} 
                    className="flex justify-center"
                    onMethodClick={handleMethodClick}
                  />
                )}
              </div>
            </div>

            {/* Right - Sequence Diagram */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 h-[calc(100vh-200px)] overflow-auto">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    Sequence Diagram
                  </h2>
                  {selectedMethod ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Flow: <code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-600 dark:text-blue-400 font-mono text-xs">{selectedMethod}</code>
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Select a method
                    </p>
                  )}
                </div>
                {selectedMethod && (
                  <button
                    onClick={() => setSelectedMethod(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 min-h-[400px]">
                {selectedMethod ? (
                  <MermaidDiagram 
                    chart={getSequenceDiagram(selectedMethod)} 
                    className="flex justify-center"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                    </svg>
                    <p className="font-medium">Click a method</p>
                    <p className="text-sm mt-2">Methods are blue</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      )}
    </div>
  );
}
