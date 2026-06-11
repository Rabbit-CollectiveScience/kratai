"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const Product_1 = require("../models/Product");
class ProductService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getAllProducts() {
        return this.repository.findAll();
    }
    async getProductById(id) {
        return this.repository.findById(id);
    }
    async createProduct(name, price, stock) {
        const product = new Product_1.Product(this.generateId(), name, price, stock);
        return this.repository.create(product);
    }
    async updateProductStock(id, quantity) {
        const product = await this.repository.findById(id);
        if (!product)
            return null;
        product.updateStock(quantity);
        return this.repository.update(id, product);
    }
    async deleteProduct(id) {
        return this.repository.delete(id);
    }
    generateId() {
        return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map