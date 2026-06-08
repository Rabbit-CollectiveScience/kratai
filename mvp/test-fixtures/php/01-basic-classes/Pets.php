<?php

require_once 'Animal.php';

class Dog extends Animal
{
    private string $breed;

    public function __construct(string $name, int $age, string $breed)
    {
        parent::__construct($name, $age, 'Canine');
        $this->breed = $breed;
    }

    public function makeSound(): void
    {
        echo "{$this->name} barks: Woof!\n";
    }

    public function fetch(string $item): void
    {
        echo "{$this->name} fetches the {$item}\n";
    }

    public function getBreed(): string
    {
        return $this->breed;
    }
}

class Cat extends Animal
{
    private bool $indoor;

    public function __construct(string $name, int $age, bool $indoor = true)
    {
        parent::__construct($name, $age, 'Feline');
        $this->indoor = $indoor;
    }

    public function makeSound(): void
    {
        echo "{$this->name} meows: Meow!\n";
    }

    public function climb(): void
    {
        echo "{$this->name} climbs a tree\n";
    }

    public function isIndoor(): bool
    {
        return $this->indoor;
    }
}
