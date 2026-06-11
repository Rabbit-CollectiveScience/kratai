"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    logger;
    database;
    constructor(logger, database) {
        this.logger = logger;
        this.database = database;
    }
    async createUser(name, email) {
        this.logger.log(`Creating user: ${name}`);
        const result = await this.database.query(`INSERT INTO users (name, email) VALUES ('${name}', '${email}')`);
        return { id: result.id, name, email };
    }
    async getUser(id) {
        this.logger.log(`Fetching user: ${id}`);
        const result = await this.database.query(`SELECT * FROM users WHERE id = ${id}`);
        return result.rows[0] || null;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map