export interface ILogger {
  log(message: string): void;
  error(message: string): void;
}

export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

export class FileLogger implements ILogger {
  constructor(private filePath: string) {}

  log(message: string): void {
    // Simulate file logging
    console.log(`[FILE:${this.filePath}] ${message}`);
  }

  error(message: string): void {
    console.log(`[FILE:${this.filePath}] ERROR: ${message}`);
  }
}
