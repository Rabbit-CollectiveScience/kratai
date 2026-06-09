const { JavaScriptParser } = require('./out/services/parsers/JavaScriptParser');
const path = require('path');

const parser = new JavaScriptParser();

console.log('Testing JavaScriptParser...\n');

// Test 1: Parse Animal.js
const animalPath = path.join(__dirname, 'test-fixtures/javascript/01-basic-classes/Animal.js');
console.log('Parsing Animal.js...');
const animalClasses = parser.parseFile(animalPath);
console.log('Found classes:', animalClasses.map(c => c.name));
console.log('Animal methods:', animalClasses[0]?.methods.map(m => m.name));
console.log('Animal properties:', animalClasses[0]?.properties.map(p => p.name));
console.log('');

// Test 2: Parse Pets.js (inheritance)
const petsPath = path.join(__dirname, 'test-fixtures/javascript/01-basic-classes/Pets.js');
console.log('Parsing Pets.js...');
const petsClasses = parser.parseFile(petsPath);
console.log('Found classes:', petsClasses.map(c => c.name));
petsClasses.forEach(cls => {
    console.log(`  ${cls.name} extends: ${cls.extends || 'none'}`);
    console.log(`  Methods: ${cls.methods.map(m => m.name).join(', ')}`);
});
console.log('');

// Test 3: Parse UserCard.jsx
const userCardPath = path.join(__dirname, 'test-fixtures/javascript/02-react-components/UserCard.jsx');
console.log('Parsing UserCard.jsx...');
const userCardClasses = parser.parseFile(userCardPath);
console.log('Found functions/modules:', userCardClasses.map(c => c.name));
console.log('');

console.log('✅ JavaScript parser is working!');
