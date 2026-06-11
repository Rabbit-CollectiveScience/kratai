const Animal = require('./Animal');

class Dog extends Animal {
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

class Cat extends Animal {
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

module.exports = { Dog, Cat };
