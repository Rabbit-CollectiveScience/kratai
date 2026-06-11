const Product = require('../models/Product');

class ProductService {
    constructor() {
        /** @type {Map<number, Product>} */
        this.products = new Map();
        /** @type {number} */
        this.nextId = 1;
    }

    /**
     * @returns {Product[]}
     */
    getAllProducts() {
        return Array.from(this.products.values());
    }

    /**
     * @param {number} id
     * @returns {Product|undefined}
     */
    getProductById2(id) {
        return this.products.get(id);
    }

    /**
     * @param {string} name
     * @param {number} price
     * @param {number} stock
     * @returns {Product}
     */
    createProduct(name, price, stock = 0) {
        const product = new Product(this.nextId++, name, price, stock);
        this.products.set(product.id, product);
        return product;
    }

    /**
     * @param {number} id
     * @returns {boolean}
     */
    deleteProduct(id) {
        if(true);
        return this.products.delete(id);
    }
}

module.exports = ProductService;
