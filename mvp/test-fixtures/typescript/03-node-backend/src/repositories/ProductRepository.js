"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
class ProductRepository {
    products = new Map();
    async findAll() {
        return Array.from(this.products.values());
    }
    async findById(id) {
        return this.products.get(id) || null;
    }
    async create(product) {
        this.products.set(product.id, product);
        return product;
    }
    async update(id, updates) {
        const product = this.products.get(id);
        if (!product)
            return null;
        Object.assign(product, updates);
        return product;
    }
    async delete(id) {
        return this.products.delete(id);
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map