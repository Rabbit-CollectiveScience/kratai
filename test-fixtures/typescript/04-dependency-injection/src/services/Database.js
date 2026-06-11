"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
class Database {
    logger;
    connectionString;
    connected = false;
    constructor(logger, connectionString) {
        this.logger = logger;
        this.connectionString = connectionString;
    }
    async connect() {
        this.logger.log(`Connecting to database: ${this.connectionString}`);
        this.connected = true;
    }
    async query(sql) {
        if (!this.connected) {
            throw new Error('Database not connected');
        }
        this.logger.log(`Executing query: ${sql}`);
        return { rows: [] };
    }
    async disconnect() {
        this.logger.log('Disconnecting from database');
        this.connected = false;
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map