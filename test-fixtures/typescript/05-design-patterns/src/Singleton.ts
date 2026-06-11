export class ConfigManager {
  private static instance: ConfigManager;
  private config: Map<string, any> = new Map();

  private constructor() {
    this.loadDefaults();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadDefaults(): void {
    this.config.set('apiUrl', 'https://api.example.com');
    this.config.set('timeout', 5000);
  }

  get(key: string): any {
    return this.config.get(key);
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
  }
}
