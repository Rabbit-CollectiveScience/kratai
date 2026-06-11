// Test PHP parser on Laravel backend fixture
const { CodeParserService } = require('./out/services/codeParserService');
const path = require('path');

async function testPHPParser() {
    const workspacePath = path.join(__dirname, 'test-fixtures/php');
    
    console.log('🐘 Testing PHP Parser...');
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
            if (cls.implements && cls.implements.length > 0) {
                console.log(`   Implements: ${cls.implements.join(', ')}`);
            }
            console.log(`   Properties: ${cls.properties.length}`);
            cls.properties.forEach(p => {
                console.log(`     ${p.visibility} ${p.isStatic ? 'static ' : ''}${p.name}: ${p.type} (line ${p.lineNumber})`);
            });
            console.log(`   Methods: ${cls.methods.length}`);
            cls.methods.forEach(m => {
                const params = m.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
                console.log(`     ${m.visibility} ${m.name}(${params}): ${m.returnType} (lines ${m.lineNumber}-${m.endLineNumber})`);
            });
            console.log('');
        });
        
        console.log(`🔗 Found ${diagramData.relationships.length} relationships:\n`);
        diagramData.relationships.forEach(rel => {
            console.log(`   ${rel.from} --${rel.type}--> ${rel.to}`);
        });
        
        console.log('\n✨ PHP parser test complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

testPHPParser();
