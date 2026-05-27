import { Project, SourceFile, ClassDeclaration, MethodDeclaration, PropertyDeclaration } from 'ts-morph';

export interface ClassInfo {
  name: string;
  properties: PropertyInfo[];
  methods: MethodInfo[];
  extends?: string;
  implements?: string[];
}

export interface PropertyInfo {
  name: string;
  type: string;
  visibility: string;
}

export interface MethodInfo {
  name: string;
  parameters: string[];
  returnType: string;
  visibility: string;
  body?: string;
}

export class CodeParser {
  private project: Project;

  constructor() {
    this.project = new Project({
      useInMemoryFileSystem: true,
    });
  }

  parseTypeScript(code: string, fileName: string = 'temp.ts'): ClassInfo[] {
    const sourceFile = this.project.createSourceFile(fileName, code, { overwrite: true });
    return this.extractClasses(sourceFile);
  }

  private extractClasses(sourceFile: SourceFile): ClassInfo[] {
    const classes: ClassInfo[] = [];
    
    sourceFile.getClasses().forEach(cls => {
      classes.push(this.extractClassInfo(cls));
    });

    return classes;
  }

  private extractClassInfo(cls: ClassDeclaration): ClassInfo {
    const properties: PropertyInfo[] = [];
    const methods: MethodInfo[] = [];

    // Extract properties
    cls.getProperties().forEach(prop => {
      properties.push({
        name: prop.getName(),
        type: this.simplifyType(prop.getType().getText()),
        visibility: this.getVisibility(prop),
      });
    });

    // Extract methods
    cls.getMethods().forEach(method => {
      methods.push(this.extractMethodInfo(method));
    });

    return {
      name: cls.getName() || 'Anonymous',
      properties,
      methods,
      extends: cls.getExtends()?.getText(),
      implements: cls.getImplements().map(i => i.getText()),
    };
  }

  private extractMethodInfo(method: MethodDeclaration): MethodInfo {
    const parameters = method.getParameters().map(p => {
      const name = p.getName();
      const type = this.simplifyType(p.getType().getText());
      return `${name}: ${type}`;
    });

    return {
      name: method.getName(),
      parameters,
      returnType: this.simplifyType(method.getReturnType().getText()),
      visibility: this.getVisibility(method),
      body: method.getBodyText() || '',
    };
  }

  private simplifyType(type: string): string {
    // Remove whitespace
    type = type.trim();
    
    // If it contains braces, parentheses, or brackets - it's a complex type
    if (type.includes('{') || type.includes('[') || type.includes('(')) {
      // Check if it's a Promise or other generic
      const genericMatch = type.match(/^(\w+)<(.+)>$/);
      if (genericMatch) {
        return genericMatch[1]; // Return just the base type (e.g., Promise, Array)
      }
      
      // For inline objects/types, return generic names
      if (type.includes('{')) return 'Object';
      if (type.includes('[')) return 'Array';
      if (type.includes('(')) return 'Function';
    }
    
    // Remove long union types
    if (type.includes('|')) {
      const parts = type.split('|');
      if (parts.length > 2 || type.length > 40) {
        return parts[0].trim();
      }
    }
    
    // Remove very long types
    if (type.length > 30) {
      // Try to extract just the main type name
      const match = type.match(/^(\w+)/);
      return match ? match[1] : 'any';
    }
    
    return type;
  }

  // Sanitize for Mermaid - more aggressive for diagram generation
  private sanitizeForMermaid(text: string): string {
    if (!text) return 'value';
    
    // Replace any characters that break Mermaid syntax
    let result = String(text)
      .replace(/\{[^}]*\}/g, 'Object')     // Replace inline objects
      .replace(/\[[^\]]*\]/g, 'Array')     // Replace inline arrays
      .replace(/<[^>]*>/g, '')             // Remove generics content
      .replace(/[<>]/g, '')                // Remove any remaining angle brackets
      .replace(/[{}()\[\]]/g, '')          // Remove all brackets and parens
      .replace(/\|/g, 'or')                // Replace unions
      .replace(/[;:,]/g, ' ')              // Replace separators with spaces
      .replace(/[^\w\s\-_.]/g, ' ')        // Replace any non-alphanumeric with spaces
      .replace(/\s+/g, ' ')                // Collapse multiple spaces
      .trim();
    
    // If result starts with a number, prefix with underscore (Mermaid doesn't like leading numbers)
    if (/^\d/.test(result)) {
      result = '_' + result;
    }
    
    // Limit length to avoid overly long text
    if (result.length > 50) {
      result = result.substring(0, 47) + '...';
    }
    
    // If result is empty or just whitespace, return default
    if (!result || result.trim() === '') {
      return 'value';
    }
    
    // Final check: ensure it's a valid identifier (starts with letter or underscore)
    if (!/^[a-zA-Z_]/.test(result)) {
      result = 'val_' + result.replace(/^[^a-zA-Z_]+/, '');
    }
    
    return result;
  }

  // Validate and clean each line of the diagram
  private cleanDiagramLine(line: string): string {
    // Remove any control characters, non-printable characters, and trailing spaces
    let cleaned = line
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/\s+$/g, ''); // Remove trailing whitespace but keep leading (for indentation)
    
    // Ensure no line ends with invalid characters
    cleaned = cleaned.replace(/[^\w\s\-_.()>+:]$/g, '');
    
    return cleaned;
  }

  private getVisibility(node: PropertyDeclaration | MethodDeclaration): string {
    if (node.hasModifier(118)) return 'private'; // ts.SyntaxKind.PrivateKeyword
    if (node.hasModifier(119)) return 'protected'; // ts.SyntaxKind.ProtectedKeyword
    return 'public';
  }

  generateClassDiagram(classes: ClassInfo[]): string {
    if (classes.length === 0) {
      return `classDiagram
        note "No classes found in this file"`;
    }

    let diagram = 'classDiagram\n';

    classes.forEach(cls => {
      diagram += `  class ${cls.name} {\n`;

      // Add properties
      cls.properties.forEach(prop => {
        const symbol = this.getVisibilitySymbol(prop.visibility);
        diagram += `    ${symbol}${prop.type} ${prop.name}\n`;
      });

      // Add methods
      cls.methods.forEach(method => {
        const symbol = this.getVisibilitySymbol(method.visibility);
        // Sanitize parameters for Mermaid - remove complex types
        const params = method.parameters
          .map(p => this.sanitizeForMermaid(p))
          .join(', ');
        const sanitizedName = this.sanitizeForMermaid(method.name);
        diagram += `    ${symbol}${sanitizedName}(${params})\n`;
      });

      diagram += '  }\n';

      // Add inheritance
      if (cls.extends) {
        diagram += `  ${cls.extends} <|-- ${cls.name}\n`;
      }

      // Add implementations
      cls.implements?.forEach(iface => {
        diagram += `  ${iface} <|.. ${cls.name}\n`;
      });
    });

    return diagram;
  }

  generateSequenceDiagram(method: MethodInfo, className: string): string {
    let diagram = 'sequenceDiagram\n';
    diagram += '  participant Client\n';
    diagram += `  participant ${className}\n`;

    console.log('Generating sequence for:', method.name);
    console.log('Method body length:', (method.body || '').length);
    console.log('Method body preview:', (method.body || '').substring(0, 200));

    // Parse method body for detailed analysis
    const analysis = this.analyzeMethodBody(method.body || '', className);
    
    console.log('Analysis result:', {
      calls: analysis.calls.length,
      sequence: analysis.sequence.length,
    });
    
    if (analysis.calls.length === 0 && analysis.sequence.length === 0) {
      diagram += `  Client->>+${className}: ${method.name}()\n`;
      
      // Show method body as note if available
      const bodyPreview = (method.body || '').trim();
      if (bodyPreview && bodyPreview.length > 0) {
        // Show first few lines of actual code
        const lines = bodyPreview.split('\n').slice(0, 5);
        const preview = this.sanitizeForMermaid(lines.join(' ').substring(0, 200));
        diagram += `  Note over ${className}: ${preview}...\n`;
      } else {
        diagram += `  Note over ${className}: Empty or abstract method\n`;
      }
      
      const sanitizedReturnType = this.sanitizeForMermaid(method.returnType);
      diagram += `  ${className}-->>-Client: ${sanitizedReturnType}\n`;
    } else {
      diagram += `  Client->>+${className}: ${method.name}()\n`;
      
      // Add all unique participants (excluding the main class)
      const participants = new Set<string>();
      analysis.calls.forEach(call => {
        if (call.object && call.object !== className && !participants.has(call.object)) {
          participants.add(call.object);
          diagram += `  participant ${call.object}\n`;
        }
      });

      // Generate sequence based on analysis
      let indent = '  ';
      
      for (const item of analysis.sequence) {
        if (item.type === 'condition') {
          const sanitizedCondition = this.sanitizeForMermaid(item.condition);
          diagram += `${indent}alt ${sanitizedCondition}\n`;
          indent += '  ';
        } else if (item.type === 'else') {
          indent = indent.substring(0, indent.length - 2);
          const sanitizedCondition = this.sanitizeForMermaid(item.condition || 'otherwise');
          diagram += `${indent}else ${sanitizedCondition}\n`;
          indent += '  ';
        } else if (item.type === 'end') {
          indent = indent.substring(0, indent.length - 2);
          diagram += `${indent}end\n`;
        } else if (item.type === 'call') {
          const target = item.object || className;
          const sanitizedMethod = this.sanitizeForMermaid(item.method);
          const sanitizedArgs = this.sanitizeForMermaid(item.args || '');
          const sanitizedReturn = this.sanitizeForMermaid(item.returnType || 'result');
          
          diagram += `${indent}${className}->>+${target}: ${sanitizedMethod}(${sanitizedArgs})\n`;
          
          // Add note for important calls
          if (this.isImportantCall(item.method)) {
            diagram += `${indent}Note right of ${target}: ${this.getCallDescription(item.method)}\n`;
          }
          
          diagram += `${indent}${target}-->>-${className}: ${sanitizedReturn}\n`;
        } else if (item.type === 'internal') {
          // Internal method call on same class
          const sanitizedMethod = this.sanitizeForMermaid(item.method);
          const sanitizedArgs = this.sanitizeForMermaid(item.args || '');
          diagram += `${indent}${className}->>${className}: ${sanitizedMethod}(${sanitizedArgs})\n`;
        } else if (item.type === 'note') {
          const sanitizedText = this.sanitizeForMermaid(item.text);
          diagram += `${indent}Note over ${className}: ${sanitizedText}\n`;
        } else if (item.type === 'loop') {
          const sanitizedCondition = this.sanitizeForMermaid(item.condition);
          diagram += `${indent}loop ${sanitizedCondition}\n`;
          indent += '  ';
        } else if (item.type === 'error') {
          const sanitizedText = this.sanitizeForMermaid(item.text);
          diagram += `${indent}Note over ${className}: ⚠️ ${sanitizedText}\n`;
        }
      }

      const sanitizedReturnType = this.sanitizeForMermaid(method.returnType);
      diagram += `  ${className}-->>-Client: ${sanitizedReturnType}\n`;
    }

    // Clean and validate the entire diagram
    const lines = diagram.split('\n').map(line => this.cleanDiagramLine(line));
    diagram = lines.join('\n');

    console.log('Generated diagram length:', diagram.length);
    console.log('Generated diagram:\n', diagram);
    return diagram;
  }

  private analyzeMethodBody(body: string, className: string): {
    calls: Array<{ object: string; method: string; args?: string; returnType?: string }>;
    conditions: Array<{ type: string; condition: string }>;
    sequence: Array<any>;
  } {
    const calls: Array<{ object: string; method: string; args?: string; returnType?: string }> = [];
    const conditions: Array<{ type: string; condition: string }> = [];
    const sequence: Array<any> = [];

    if (!body) {
      console.log('No method body to analyze');
      return { calls, conditions, sequence };
    }

    console.log('Analyzing body, length:', body.length);

    // Remove comments for cleaner parsing
    body = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

    // Split by lines for analysis
    const lines = body.split('\n');
    console.log('Total lines:', lines.length);
    
    let braceDepth = 0;
    let detectedCalls = 0;
    const openBlocks: string[] = []; // Track what blocks are open
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;

      // Track brace depth
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      
      // Closing brace at start - close any open blocks first
      if (line.startsWith('}')) {
        while (openBlocks.length > 0 && (openBlocks[openBlocks.length - 1] === 'if' || 
               openBlocks[openBlocks.length - 1] === 'loop' ||
               openBlocks[openBlocks.length - 1] === 'else')) {
          sequence.push({ type: 'end' });
          openBlocks.pop();
        }
      }
      
      braceDepth += openBraces - closeBraces;

      // Detect if statements
      const ifMatch = line.match(/^if\s*\((.*?)\)\s*(\{?)/);
      if (ifMatch) {
        const condition = ifMatch[1].substring(0, 60);
        const hasOpenBrace = ifMatch[2] === '{';
        
        // Only track as a block if it has an opening brace
        // Single-line if statements without braces don't need closing
        if (hasOpenBrace || line.includes('{')) {
          conditions.push({ type: 'if', condition });
          sequence.push({ type: 'condition', condition });
          openBlocks.push('if');
        }
        // Skip single-line if statements - they're not blocks
        continue;
      }

      // Detect else statements
      if (line.match(/^\}\s*else\s*if\s*\(/)) {
        if (openBlocks[openBlocks.length - 1] === 'if') {
          sequence.push({ type: 'end' });
          openBlocks.pop();
        }
        const elseIfMatch = line.match(/else\s*if\s*\((.*?)\)/);
        const condition = elseIfMatch ? elseIfMatch[1].substring(0, 60) : 'otherwise';
        sequence.push({ type: 'condition', condition });
        openBlocks.push('if');
        continue;
      } else if (line.match(/^\}\s*else\s*\{/) || line.match(/^else\s*\{?/)) {
        if (openBlocks[openBlocks.length - 1] === 'if') {
          sequence.push({ type: 'end' });
          openBlocks.pop();
        }
        sequence.push({ type: 'else' });
        openBlocks.push('else');
        continue;
      }

      // Detect end of blocks (closing braces at start of line) - already handled above

      // Detect loops
      const loopMatch = line.match(/^(for|while)\s*\((.*?)\)\s*(\{?)/);
      if (loopMatch) {
        const loopType = loopMatch[1];
        const condition = loopMatch[2].substring(0, 40);
        const hasOpenBrace = loopMatch[3] === '{';
        
        // Only track as a block if it has braces
        if (hasOpenBrace || line.includes('{')) {
          sequence.push({ type: 'loop', condition: `${loopType} ${condition}` });
          openBlocks.push('loop');
        }
        continue;
      }

      // Detect forEach/map/filter - these always create implicit blocks
      const arrayMethodMatch = line.match(/\.(forEach|map|filter|reduce)\s*\(/);
      if (arrayMethodMatch) {
        // Only add loop if the callback has content (not just single expression)
        // For now, just add a note instead of a block
        sequence.push({ type: 'note', text: `${arrayMethodMatch[1]} operation` });
        continue;
      }

      // Detect try-catch
      if (line.match(/^try\s*\{/)) {
        sequence.push({ type: 'note', text: 'Try: error handling' });
        continue;
      }

      if (line.match(/^catch\s*\(/)) {
        sequence.push({ type: 'else', condition: 'error caught' });
        continue;
      }

      // Detect await calls (highest priority)
      const awaitMatch = line.match(/await\s+(?:this\.)?(\w+)\.(\w+)\s*\((.*?)\)/);
      if (awaitMatch) {
        const [, object, method, args] = awaitMatch;
        const cleanArgs = args.substring(0, 30);
        
        calls.push({ object, method, args: cleanArgs, returnType: 'Promise' });
        sequence.push({ 
          type: 'call', 
          object, 
          method, 
          args: cleanArgs,
          returnType: 'result' 
        });
        continue;
      }

      // Detect this.property.method() calls (e.g., this.repository.save())
      const thisPropMethodMatch = line.match(/this\.(\w+)\.(\w+)\s*\((.*?)\)/);
      if (thisPropMethodMatch) {
        const [, property, method, args] = thisPropMethodMatch;
        const cleanArgs = args.substring(0, 30);
        
        // Capitalize property to make it look like a class
        const objectName = property.charAt(0).toUpperCase() + property.slice(1);
        
        console.log('Detected this.property.method:', objectName, method);
        detectedCalls++;
        
        calls.push({ object: objectName, method, args: cleanArgs });
        sequence.push({ 
          type: 'call', 
          object: objectName, 
          method, 
          args: cleanArgs 
        });
        continue;
      }

      // Detect this.method() calls (internal methods)
      const thisMethodMatch = line.match(/this\.(\w+)\s*\((.*?)\)/);
      if (thisMethodMatch) {
        const [, method, args] = thisMethodMatch;
        const cleanArgs = args.substring(0, 30);
        
        console.log('Detected this.method:', method);
        detectedCalls++;
        
        sequence.push({ 
          type: 'internal', 
          method, 
          args: cleanArgs 
        });
        continue;
      }

      // Detect regular method calls (object.method())
      const callMatch = line.match(/(\w+)\.(\w+)\s*\((.*?)\)/);
      if (callMatch) {
        const [, object, method, args] = callMatch;
        
        // Skip console
        if (object === 'console') continue;
        
        const cleanArgs = args.substring(0, 30);
        
        calls.push({ object, method, args: cleanArgs });
        sequence.push({ 
          type: 'call', 
          object, 
          method, 
          args: cleanArgs 
        });
        continue;
      }

      // Detect new Class() instantiation
      const newMatch = line.match(/new\s+(\w+)\s*\(/);
      if (newMatch) {
        sequence.push({ type: 'note', text: `Create ${newMatch[1]} instance` });
        continue;
      }

      // Detect throws
      if (line.match(/throw\s+/)) {
        const errorMatch = line.match(/throw\s+new\s+(\w+)/);
        const errorType = errorMatch ? errorMatch[1] : 'Error';
        sequence.push({ type: 'error', text: `Throw ${errorType}` });
        continue;
      }

      // Detect return with method call
      const returnCallMatch = line.match(/return\s+(?:await\s+)?(?:this\.)?(\w+)\.(\w+)\s*\(/);
      if (returnCallMatch) {
        const [, object, method] = returnCallMatch;
        if (object !== 'console') {
          calls.push({ object, method });
          sequence.push({ type: 'call', object, method, returnType: 'returned' });
        }
      }
    }

    // Close any remaining open blocks
    while (openBlocks.length > 0) {
      sequence.push({ type: 'end' });
      openBlocks.pop();
    }

    console.log('Analysis complete - Detected calls:', detectedCalls);
    console.log('Total calls in array:', calls.length);
    console.log('Total sequence items:', sequence.length);

    return { calls, conditions, sequence };
  }

  private isImportantCall(method: string): boolean {
    const importantPatterns = ['save', 'create', 'update', 'delete', 'find', 'query', 'execute', 'validate', 'send', 'fetch'];
    return importantPatterns.some(pattern => method.toLowerCase().includes(pattern));
  }

  private getCallDescription(method: string): string {
    const descriptions: Record<string, string> = {
      'save': 'Persist data',
      'create': 'Create new record',
      'update': 'Update existing record',
      'delete': 'Remove record',
      'find': 'Query data',
      'query': 'Execute query',
      'execute': 'Execute operation',
      'validate': 'Validate input',
      'send': 'Send request',
      'fetch': 'Fetch data',
    };

    for (const [key, desc] of Object.entries(descriptions)) {
      if (method.toLowerCase().includes(key)) {
        return desc;
      }
    }

    return 'Process';
  }

  private getVisibilitySymbol(visibility: string): string {
    switch (visibility) {
      case 'private':
        return '-';
      case 'protected':
        return '#';
      case 'public':
      default:
        return '+';
    }
  }
}

export const codeParser = new CodeParser();
