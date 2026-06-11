# JavaScript Test Fixtures

Example JavaScript projects for testing Kratai's code visualization features.

## ✅ JavaScript Support Now Available!

Kratai now parses JavaScript (`.js`) and JSX (`.jsx`) files using the Strategy Pattern architecture.

## Available Examples

```
javascript/
├── 01-basic-classes/      ✅ ES6 classes with inheritance
└── 02-react-components/   ✅ React function components + hooks
```

## Implemented Examples

### 01 - Basic Classes
- `Animal.js` - ES6 class with constructor and methods
- `Pets.js` - Dog and Cat classes extending Animal
- `PetOwner.js` - Composition example with array of pets
- **Features:** Constructor property inference, inheritance detection, method extraction

### 02 - React Components
- `useFetch.js` - Custom React hook with useState/useEffect
- `UserCard.jsx` - Function component with props destructuring
- `UserList.jsx` - Component using UserCard + useFetch
- **Features:** JSX parsing, function component detection, module-level exports

## Parser Capabilities

The `JavaScriptParser` can detect:
- ✅ ES6 class declarations
- ✅ Class inheritance (`extends`)
- ✅ Constructor properties (`this.x = ...`)
- ✅ Methods (regular, static, async)
- ✅ JSX syntax
- ✅ Function components
- ✅ Module-level functions
- ✅ CommonJS and ES6 module exports

## Testing

Run the test script:
```bash
cd /Users/nightrabbit/Documents/GitHub/kratai/mvp
node test-js-parser.js
```

Expected output:
```
Found classes: [ 'Animal', 'Dog', 'Cat', 'PetOwner' ]
Dog extends: Animal
Cat extends: Animal
```

## Usage in Kratai

1. Open a workspace with `.js` or `.jsx` files
2. Run **Kratai: Generate Class Diagram**
3. JavaScript classes will appear alongside TypeScript classes
4. Inheritance relationships are visualized

## Future Enhancements

- [ ] Prototype-based classes
- [ ] Class fields proposal syntax
- [ ] JSDoc type annotations
- [ ] Flow type inference
