const ProductService = require('../services/ProductService');

class ProductController {
    /**
     * @param {ProductService} productService
     */
    constructor(productService) {
        /** @type {ProductService} */
        this.productService = productService;
    }

    /**
     * @returns {{products: Product[], count: number}}
     */
    getAll() {
        const products = this.productService.getAllProducts();
        return { products, count: products.length };
    }

    /**
     * @param {number} id
     * @returns {{product: Product}|{error: string}}
     */
    getById(id) {
        const product = this.productService.getProductById2(id);
        if (product) {
            return { product };
        }
        return { error: 'Product not found' };
    }

    /**
     * @param {string} name
     * @param {number} price
     * @param {number} stock
     * @returns {{product: Product}}
     */
    create(name, price, stock = 0) {
        const product = this.productService.createProduct(name, price, stock);
        return { product };
    }

    /**
     * @param {number} id
     * @returns {{success: boolean, message: string}}
     */
    delete(id) {
        const success = this.productService.deleteProduct(id);
        return {
            success,
            message: success ? 'Product deleted' : 'Product not found'
        };
    }
}

module.exports = ProductController;
