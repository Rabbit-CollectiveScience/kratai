"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
class Animal {
    name;
    age;
    species;
    constructor(name, age, species) {
        this.name = name;
        this.age = age;
        this.species = species;
    }
    eat(food) {
        console.log(`${this.name} is eating ${food}`);
    }
    getInfo() {
        return `${this.name} (${this.species}), age ${this.age}`;
    }
}
exports.Animal = Animal;
//# sourceMappingURL=Animal.js.map