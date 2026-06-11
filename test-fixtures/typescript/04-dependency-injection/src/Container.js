"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const Logger_1 = require("./services/Logger");
const Database_1 = require("./services/Database");
const UserService_1 = require("./services/UserService");
class Container {
    services = new Map();
    register(name, instance) {
        this.services.set(name, instance);
    }
    resolve(name) {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service '${name}' not found`);
        }
        return service;
    }
    static createDefault() {
        const container = new Container();
        // Register logger
        const logger = new Logger_1.ConsoleLogger();
        container.register('logger', logger);
        // Register database (depends on logger)
        const database = new Database_1.Database(logger, 'postgresql://localhost/mydb');
        container.register('database', database);
        // Register UserService (depends on logger and database)
        const userService = new UserService_1.UserService(logger, database);
        container.register('userService', userService);
        return container;
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map