<?php

require_once 'Animal.php';

class PetOwner
{
    private string $name;
    private string $address;
    private array $pets = [];

    public function __construct(string $name, string $address)
    {
        $this->name = $name;
        $this->address = $address;
    }

    public function addPet(Animal $pet): void
    {
        $this->pets[] = $pet;
        echo "{$this->name} adopted {$pet->getName()}\n";
    }

    public function listPets(): void
    {
        echo "{$this->name}'s pets:\n";
        foreach ($this->pets as $pet) {
            echo "- {$pet->getInfo()}\n";
        }
    }

    public function feedAllPets(string $food): void
    {
        foreach ($this->pets as $pet) {
            $pet->eat($food);
        }
    }

    public function getPetCount(): int
    {
        return count($this->pets);
    }
}
