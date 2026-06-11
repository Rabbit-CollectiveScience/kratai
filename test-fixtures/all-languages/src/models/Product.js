class Product {
    /**
     * @param {number} id
     * @param {string} name
     * @param {number} price
     * @param {number} stock
     */
    constructor(id, name, price, stock = 0) {
        /** @type {number} */
        this.id = id;
        /** @type {string} */
        this.name = name;
        /** @type {number} */
        this.price = price;
        /** @type {number} */
        this.stock = stock;
    }

    /**
     * @returns {boolean}
     */
    isAvailable() {
        return this.stock > 0;
    }

    /**
     * @param {number} quantity
     * @returns {void}
     */
    updateStock(quantity) {
        this.stock += quantity;
    }
}

module.exports = Product;
