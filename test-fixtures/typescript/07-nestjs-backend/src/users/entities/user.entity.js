"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    name;
    email;
    password;
    createdAt;
    updatedAt;
    constructor(name, email, password) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map