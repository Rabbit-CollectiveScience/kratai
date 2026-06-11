import { ILogger } from './Logger';

export interface IDatabase {
  connect(): Promise<void>;
  query(sql: string): Promise<any>;
  disconnect(): Promise<void>;
}

export class Database implements IDatabase {
  private connected: boolean = false;

  constructor(
    private logger: ILogger,
    private connectionString: string
  ) {}

  async connect(): Promise<void> {
    this.logger.log(`Connecting to database: ${this.connectionString}`);
    this.connected = true;
  }

  async query(sql: string): Promise<any> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    this.logger.log(`Executing query: ${sql}`);
    return { rows: [] };
  }

  async disconnect(): Promise<void> {
    this.logger.log('Disconnecting from database');
    this.connected = false;
  }
}
