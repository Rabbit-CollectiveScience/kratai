import { Animal } from './Animal';

export class Dog extends Animal {
  private breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age, 'Canine');
    this.breed = breed;
  }

  makeSound(): void {
    console.log(`${this.name} barks: Woof!`);
  }

  fetch(item: string): void {
    console.log(`${this.name} fetches the ${item}`);
  }

  getBreed(): string {
    return this.breed;
  }
}

export class Cat extends Animal {
  private indoor: boolean;

  constructor(name: string, age: number, indoor: boolean = true) {
    super(name, age, 'Feline');
    this.indoor = indoor;
  }

  makeSound(): void {
    console.log(`${this.name} meows: Meow!`);
  }

  climb(): void {
    console.log(`${this.name} climbs a tree`);
  }

  isIndoor(): boolean {
    return this.indoor;
  }
}
