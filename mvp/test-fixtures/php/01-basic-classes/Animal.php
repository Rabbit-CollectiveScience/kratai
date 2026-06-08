<?php

interface AnimalInterface
{
    public function makeSound(): void;
    public function eat(string $food): void;
}

abstract class Animal implements AnimalInterface
{
    protected string $name;
    protected int $age;
    protected string $species;

    public function __construct(string $name, int $age, string $species)
    {
        $this->name = $name;
        $this->age = $age;
        $this->species = $species;
    }

    abstract public function makeSound(): void;

    public function eat(string $food): void
    {
        echo "{$this->name} is eating {$food}\n";
    }

    public function getInfo(): string
    {
        return "{$this->name} ({$this->species}), age {$this->age}";
    }

    public function getName(): string
    {
        return $this->name;
    }
}
