"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    id;
    name;
    price;
    stock;
    createdAt;
    constructor(id, name, price, stock, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.createdAt = createdAt;
    }
    updateStock(quantity) {
        this.stock += quantity;
    }
    isAvailable() {
        return this.stock > 0;
    }
}
exports.Product = Product;
//# sourceMappingURL=Product.js.map