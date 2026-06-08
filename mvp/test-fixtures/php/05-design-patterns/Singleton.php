<?php

class ConfigManager
{
    private static ?ConfigManager $instance = null;
    private array $config = [];

    private function __construct()
    {
        $this->loadDefaults();
    }

    private function __clone() {}

    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize singleton");
    }

    public static function getInstance(): ConfigManager
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function loadDefaults(): void
    {
        $this->config['api_url'] = 'https://api.example.com';
        $this->config['timeout'] = 5000;
    }

    public function get(string $key)
    {
        return $this->config[$key] ?? null;
    }

    public function set(string $key, $value): void
    {
        $this->config[$key] = $value;
    }
}
