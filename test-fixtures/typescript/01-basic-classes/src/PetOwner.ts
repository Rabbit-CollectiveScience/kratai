import { Dog, Cat } from './Pets';
import { Animal } from './Animal';

export class PetOwner {
  private pets: Animal[] = [];

  constructor(
    public name: string,
    private address: string
  ) {}

  addPet(pet: Animal): void {
    this.pets.push(pet);
    console.log(`${this.name} adopted ${pet.name}`);
  }

  listPets(): void {
    console.log(`${this.name}'s pets:`);
    this.pets.forEach(pet => console.log(`- ${pet.getInfo()}`));
  }

  feedAllPets(food: string): void {
    this.pets.forEach(pet => pet.eat(food));
  }

  getPetCount(): number {
    return this.pets.length;
  }
}
