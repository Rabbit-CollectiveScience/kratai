// Test Python parser on FastAPI backend fixture
const { CodeParserService } = require('./out/services/codeParserService');
const path = require('path');

async function testPythonParser() {
    const workspacePath = path.join(__dirname, 'test-fixtures/python');
    
    console.log('🐍 Testing Python Parser...');
    console.log(`📂 Workspace: ${workspacePath}\n`);
    
    try {
        const diagramData = await CodeParserService.parseWorkspace(workspacePath);
        
        console.log(`✅ Found ${diagramData.classes.length} classes:\n`);
        
        diagramData.classes.forEach(cls => {
            console.log(`📦 ${cls.name} (${cls.classType})`);
            console.log(`   File: ${cls.filePath}`);
            if (cls.extends) {
                console.log(`   Extends: ${cls.extends}`);
            }
            console.log(`   Properties: ${cls.properties.length}`);
            cls.properties.forEach(p => {
                console.log(`     + ${p.name}: ${p.type} (line ${p.lineNumber})`);
            });
            console.log(`   Methods: ${cls.methods.length}`);
            cls.methods.forEach(m => {
                const params = m.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
                console.log(`     + ${m.name}(${params}) -> ${m.returnType} (lines ${m.lineNumber}-${m.endLineNumber})`);
            });
            console.log('');
        });
        
        console.log(`🔗 Found ${diagramData.relationships.length} relationships:\n`);
        diagramData.relationships.forEach(rel => {
            console.log(`   ${rel.from} --${rel.type}--> ${rel.to}`);
        });
        
        console.log('\n✨ Python parser test complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

testPythonParser();
