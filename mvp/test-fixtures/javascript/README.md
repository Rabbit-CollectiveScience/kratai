# JavaScript Support (Planned)

Plain JavaScript support is planned for a future release.

## Current Status

Kratai currently uses the TypeScript AST parser, which can parse some JavaScript files but lacks full support for:
- ES6+ class syntax without types
- Prototype-based inheritance
- Dynamic property assignment
- CommonJS modules

## Roadmap

Full JavaScript support will require:
- Enhanced parser configuration for plain JS
- Inference of class relationships without type annotations
- Support for both ES6 classes and prototype patterns

## Contribute

If you're interested in contributing JavaScript support, please open a discussion or issue on GitHub.
