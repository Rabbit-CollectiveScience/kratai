<?php

interface Observer
{
    public function update($data): void;
}

interface Subject
{
    public function attach(Observer $observer): void;
    public function detach(Observer $observer): void;
    public function notify($data): void;
}

class EventEmitter implements Subject
{
    private array $observers = [];

    public function attach(Observer $observer): void
    {
        $this->observers[] = $observer;
    }

    public function detach(Observer $observer): void
    {
        $key = array_search($observer, $this->observers, true);
        if ($key !== false) {
            unset($this->observers[$key]);
        }
    }

    public function notify($data): void
    {
        foreach ($this->observers as $observer) {
            $observer->update($data);
        }
    }
}

class Logger implements Observer
{
    public function update($data): void
    {
        echo "[Logger] Event received: " . print_r($data, true) . "\n";
    }
}

class EmailNotifier implements Observer
{
    public function update($data): void
    {
        echo "[EmailNotifier] Sending email for: " . print_r($data, true) . "\n";
    }
}
