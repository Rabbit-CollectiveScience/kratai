# PHP Test Fixtures

Example PHP projects for testing Kratai's code visualization features (when PHP support is added).

## Available Examples

```
php/
├── 01-basic-classes/          ✅ Classes, interfaces, inheritance
├── 02-laravel-components/     ✅ Laravel MVC with repository pattern
├── 03-backend-service/        🚧 Placeholder
├── 04-dependency-injection/   🚧 Placeholder
├── 05-design-patterns/        ✅ Singleton, Observer, Strategy
├── 06-symfony-app/            🚧 Placeholder
└── 07-api-backend/            🚧 Placeholder
```

## Implemented Examples

### 01 - Basic Classes
- `Animal.php` - Abstract class with interface
- `Pets.php` - Dog and Cat inheritance
- `PetOwner.php` - Composition example
- Demonstrates: OOP basics, interfaces, abstract classes, visibility modifiers

### 02 - Laravel Components (⭐ Featured)
- **Models.php** - Eloquent models (User, Post) with relationships
- **UserRepository.php** - Repository pattern with interface
- **UserService.php** - Service layer with business logic
- **UserController.php** - REST controller with validation
- **composer.json** - Laravel dependencies
- Demonstrates: MVC architecture, dependency injection, Eloquent ORM, repository pattern

### 05 - Design Patterns
- **Singleton.php** - ConfigManager with single instance
- **Observer.php** - EventEmitter with Logger and EmailNotifier
- **Strategy.php** - Payment strategies (CreditCard, PayPal, Crypto)
- Demonstrates: Common design patterns in PHP

## Laravel Architecture Highlights

The Laravel example showcases professional backend architecture:
- **Controller** → handles HTTP requests and responses
- **Service** → contains business logic (password hashing, etc.)
- **Repository** → abstracts data access layer
- **Model** → Eloquent ORM with relationships

This layered architecture demonstrates:
- Separation of concerns
- Dependency injection via constructor
- Interface-based contracts
- PSR-4 autoloading

## PHP Support Status

🚧 **PHP language support is planned for a future release.**

Currently only TypeScript is supported. These fixtures are ready for when PHP parsing is implemented.

## Contributing

To add more examples or complete the placeholder projects:
- Add Symfony examples (controllers, entities, services)
- Add standalone API backend examples
- Create dependency injection container examples
- Submit a PR with working PHP code demonstrating specific patterns
