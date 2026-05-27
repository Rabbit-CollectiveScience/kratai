// Quick test to validate Mermaid syntax
const testDiagram = `sequenceDiagram
  participant Client
  participant CreateProjectUseCase
  participant Repository
  
  Client->>+CreateProjectUseCase: execute(input Object)
  CreateProjectUseCase->>+Repository: save(data Object)
  Repository-->>-CreateProjectUseCase: result
  CreateProjectUseCase-->>-Client: Promise`;

console.log('Test diagram:');
console.log(testDiagram);
console.log('\nChecking for problematic characters...');

const lines = testDiagram.split('\n');
lines.forEach((line, index) => {
  const lineNum = index + 1;
  // Check for non-ASCII characters
  const nonAscii = line.match(/[^\x00-\x7F]/g);
  if (nonAscii) {
    console.log(`Line ${lineNum}: Non-ASCII chars found:`, nonAscii);
  }
  
  // Check for numbers in wrong places
  const afterColon = line.match(/:\s*(\S+)/);
  if (afterColon && afterColon[1]) {
    console.log(`Line ${lineNum}: After colon: "${afterColon[1]}"`);
    if (/^\d/.test(afterColon[1])) {
      console.log(`  ⚠️ STARTS WITH NUMBER!`);
    }
  }
});

console.log('\n✅ If no warnings above, diagram should be valid');
