# Kratai — Code Visualizer

Understand your codebase at a glance across **TypeScript, JavaScript, Python, and PHP**. Kratai generates interactive **class diagrams** and **sequence diagrams** directly inside VS Code, with **git diff highlighting** so you can instantly see what changed between commits.

![Kratai in Action](demo/demo.gif)

---

## ✨ Key Features

- 🗺️ **Interactive Class Diagrams** — Visualize your entire codebase with folder-based organization
- 🔄 **Sequence Diagrams** — Click any method to trace its execution flow across classes
- 📊 **Git Diff Highlighting** — See what changed at a glance (green = added, yellow = modified, red = deleted)
- 🌍 **Multi-Language Support** — Works with TypeScript, JavaScript, Python, and PHP in the same project
- 🎯 **Smart Relationships** — Auto-detects inheritance, interfaces, and dependencies
- ⚙️ **Fully Configurable** — Choose which folders, files, and relationships to display

---

## 🚀 Getting Started

1. **Install** the extension from VS Code Marketplace
2. **Open** a project with `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, or `.php` files
3. **Click** the Kratai icon in the Activity Bar (left sidebar)
4. **Configure** which folders to scan (first-time setup)
5. **Generate** your class diagram and start exploring!

Click any method in the diagram to open its sequence diagram and see the complete call chain.

---

## 📸 Visual Tour

### Class Diagram with Git Diff Highlighting
See your entire codebase structure with color-coded changes from your last commit:

![Class Diagram Example](demo/demo_ss_1.png)

### Git Change Detection
**Green** highlights show new methods, **yellow** shows modifications, and **red** shows deletions:

![Git Diff Highlighting](demo/demo_ss_2.png)

### Sequence Diagrams
Click any method to trace its execution path. Entry/exit arrows show method invocation and return:

![Sequence Diagram Example](demo/demo_ss_3.png)

### Easy Configuration
Control exactly what gets visualized with the built-in settings panel:

![Configuration Panel](demo/demo_ss_4.png)

---

## 🌐 Supported Languages

| Language | Status | Parser | Features |
|---|---|---|---|
| **TypeScript** | ✅ Full Support | TypeScriptParser | Generics, decorators, interfaces, React/NestJS patterns |
| **JavaScript** | ✅ Full Support | JavaScriptParser | ES6 classes, JSX, JSDoc type annotations, React hooks |
| **Python** | ✅ Full Support | PythonParser | Complex type hints (Optional, List, Dict), async/await, protocols |
| **PHP** | ✅ Full Support | PHPParser | PHP 7.4+/8.0+ type hints, Laravel/Symfony, traits |

Works great with polyglot codebases! Visualize a TypeScript frontend and Python backend in one diagram.

---

## ⚙️ Configuration

Kratai stores settings in `.vscode/kratai.json` in your workspace:

- **Folders to scan** — Specify which source directories to include
- **File extensions** — Select languages: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.php`
- **Class type filters** — Show/hide interfaces, modules, classes
- **Relationship type filters** — Show/hide inheritance, usage, implementation
- **Git diff base commit** — Defaults to `HEAD~1`, customize for other comparisons

---

## 📋 Requirements

- VS Code 1.120.0 or higher
- A code project with supported languages
- Git repository (optional, for diff highlighting)

---

## ⚠️ Known Issues

- Very large codebases (1000+ classes) may render slowly

---

## 📝 Release Notes

### 1.0.1 (Latest)
- ✨ **Enhanced JavaScript parser** — JSDoc type annotations now parsed for accurate relationship detection
- 🐍 **Improved Python parser** — Complex type hints like `Optional[Product]`, `List[str]`, `Dict[str, int]` fully supported
- 🎯 **Better sequence diagrams** — Entry/exit arrows clearly show method invocation and return points
- 🐛 **Bug fixes** — JavaScript classes now show relationship arrows based on JSDoc types

### 1.0.0
- 🚀 **Multi-language support** — TypeScript, JavaScript, Python, and PHP
- 📊 Interactive class diagram with folder-based layout
- 🏗️ **Strategy Pattern architecture** — Add new languages with ~10 lines of code
- 🔄 Sequence diagram generation by clicking any method
- 🎨 Git diff highlighting — added, modified, and deleted detection
- 🔑 **Unique ID system** — Handles same class names across languages
- ⚙️ Configurable folder and class type filters
- ✅ 23+ test fixtures validating parser capabilities

---

## 🔗 Links

- 🌐 [Website](https://kratai.com)
- 📦 [GitHub Repository](https://github.com/Rabbit-CollectiveScience/kratai-core)
- 🐛 [Report an Issue](https://github.com/Rabbit-CollectiveScience/kratai-core/issues)
- 💬 [Community Discussions](https://github.com/Rabbit-CollectiveScience/kratai-core/discussions)

---

**Made with ❤️ by the Kratai team** | [MIT License](LICENSE)
