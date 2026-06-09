class Animal {
    constructor(name, age, species) {
        this.name = name;
        this.age = age;
        this.species = species;
    }

    makeSound() {
        throw new Error('Method must be implemented by subclass');
    }

    eat(food) {
        console.log(`${this.name} is eating ${food}`);
    }

    getInfo() {
        return `${this.name} (${this.species}), age ${this.age}`;
    }
}

module.exports = Animal;
