'use client';

import { useState, useEffect } from 'react';
import MermaidDiagram from '@/components/MermaidDiagram';
import SequenceModal from '@/components/SequenceModal';

export default function Home() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

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

  // Sample class diagram showing code structure
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
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Mermaid Class Diagram POC
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Interactive UML class diagrams powered by Mermaid.js in Next.js
          </p>
        </div>

        {/* Diagram Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">
                Sample Application Architecture
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                This diagram shows the relationships between UserService, Database, and AuthService classes.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <MermaidDiagram 
                chart={classDiagram} 
                className="flex justify-center"
                onMethodClick={handleMethodClick}
              />
            </div>

            {/* Instruction */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                💡 <strong>Try it:</strong> Click on any method (text with parentheses) to see its sequence diagram!
              </p>
            </div>
          </div>
        </div>

        {/* Sequence Modal */}
        <SequenceModal
          isOpen={selectedMethod !== null}
          onClose={() => setSelectedMethod(null)}
          methodName={selectedMethod || ''}
          sequenceDiagram={getSequenceDiagram(selectedMethod || '')}
        />

        {/* Info Section */}
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              📊 UML Diagrams
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Visualize class structures, relationships, and dependencies with standard UML notation.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              🎨 Customizable
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Style diagrams with colors, themes, and custom CSS. Add diff visualization easily.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              ⚡ Interactive
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Add click handlers, tooltips, and navigation to make diagrams truly interactive.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
