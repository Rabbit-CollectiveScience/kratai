const Animal = require('./Animal');

class PetOwner {
    constructor(name, address) {
        this.name = name;
        this.address = address;
        this.pets = [];
    }

    addPet(pet) {
        this.pets.push(pet);
        console.log(`${this.name} adopted ${pet.name}`);
    }

    listPets() {
        console.log(`${this.name}'s pets:`);
        this.pets.forEach(pet => {
            console.log(`- ${pet.getInfo()}`);
        });
    }

    feedAllPets(food) {
        this.pets.forEach(pet => {
            pet.eat(food);
        });
    }

    getPetCount() {
        return this.pets.length;
    }
}

module.exports = PetOwner;
