"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLogger = exports.ConsoleLogger = void 0;
class ConsoleLogger {
    log(message) {
        console.log(`[LOG] ${message}`);
    }
    error(message) {
        console.error(`[ERROR] ${message}`);
    }
}
exports.ConsoleLogger = ConsoleLogger;
class FileLogger {
    filePath;
    constructor(filePath) {
        this.filePath = filePath;
    }
    log(message) {
        // Simulate file logging
        console.log(`[FILE:${this.filePath}] ${message}`);
    }
    error(message) {
        console.log(`[FILE:${this.filePath}] ERROR: ${message}`);
    }
}
exports.FileLogger = FileLogger;
//# sourceMappingURL=Logger.js.map