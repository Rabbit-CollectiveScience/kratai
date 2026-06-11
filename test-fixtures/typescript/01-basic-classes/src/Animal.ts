export interface IAnimal {
  name: string;
  age: number;
  makeSound(): void;
  eat(food: string): void;
}

export abstract class Animal implements IAnimal {
  constructor(
    public name: string,
    public age: number,
    protected species: string
  ) {}

  abstract makeSound(): void;

  eat(food: string): void {
    console.log(`${this.name} is eating ${food}`);
  }

  getInfo(): string {
    return `${this.name} (${this.species}), age ${this.age}`;
  }
}
