import { ILogger } from './Logger';
import { IDatabase } from './Database';

export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserService {
  constructor(
    private logger: ILogger,
    private database: IDatabase
  ) {}

  async createUser(name: string, email: string): Promise<User> {
    this.logger.log(`Creating user: ${name}`);
    const result = await this.database.query(
      `INSERT INTO users (name, email) VALUES ('${name}', '${email}')`
    );
    return { id: result.id, name, email };
  }

  async getUser(id: number): Promise<User | null> {
    this.logger.log(`Fetching user: ${id}`);
    const result = await this.database.query(`SELECT * FROM users WHERE id = ${id}`);
    return result.rows[0] || null;
  }
}
