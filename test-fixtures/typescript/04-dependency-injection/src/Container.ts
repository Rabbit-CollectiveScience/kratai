import { ILogger, ConsoleLogger } from './services/Logger';
import { IDatabase, Database } from './services/Database';
import { UserService } from './services/UserService';

type Constructor<T> = new (...args: any[]) => T;

export class Container {
  private services: Map<string, any> = new Map();

  register<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }
    return service;
  }

  static createDefault(): Container {
    const container = new Container();

    // Register logger
    const logger = new ConsoleLogger();
    container.register<ILogger>('logger', logger);

    // Register database (depends on logger)
    const database = new Database(logger, 'postgresql://localhost/mydb');
    container.register<IDatabase>('database', database);

    // Register UserService (depends on logger and database)
    const userService = new UserService(logger, database);
    container.register<UserService>('userService', userService);

    return container;
  }
}
