"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
class ConfigManager {
    static instance;
    config = new Map();
    constructor() {
        this.loadDefaults();
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    loadDefaults() {
        this.config.set('apiUrl', 'https://api.example.com');
        this.config.set('timeout', 5000);
    }
    get(key) {
        return this.config.get(key);
    }
    set(key, value) {
        this.config.set(key, value);
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=Singleton.js.map