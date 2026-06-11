"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cat = exports.Dog = void 0;
const Animal_1 = require("./Animal");
class Dog extends Animal_1.Animal {
    breed;
    constructor(name, age, breed) {
        super(name, age, 'Canine');
        this.breed = breed;
    }
    makeSound() {
        console.log(`${this.name} barks: Woof!`);
    }
    fetch(item) {
        console.log(`${this.name} fetches the ${item}`);
    }
    getBreed() {
        return this.breed;
    }
}
exports.Dog = Dog;
class Cat extends Animal_1.Animal {
    indoor;
    constructor(name, age, indoor = true) {
        super(name, age, 'Feline');
        this.indoor = indoor;
    }
    makeSound() {
        console.log(`${this.name} meows: Meow!`);
    }
    climb() {
        console.log(`${this.name} climbs a tree`);
    }
    isIndoor() {
        return this.indoor;
    }
}
exports.Cat = Cat;
//# sourceMappingURL=Pets.js.map