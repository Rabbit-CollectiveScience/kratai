"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetOwner = void 0;
class PetOwner {
    name;
    address;
    pets = [];
    constructor(name, address) {
        this.name = name;
        this.address = address;
    }
    addPet(pet) {
        this.pets.push(pet);
        console.log(`${this.name} adopted ${pet.name}`);
    }
    listPets() {
        console.log(`${this.name}'s pets:`);
        this.pets.forEach(pet => console.log(`- ${pet.getInfo()}`));
    }
    feedAllPets(food) {
        this.pets.forEach(pet => pet.eat(food));
    }
    getPetCount() {
        return this.pets.length;
    }
}
exports.PetOwner = PetOwner;
//# sourceMappingURL=PetOwner.js.map