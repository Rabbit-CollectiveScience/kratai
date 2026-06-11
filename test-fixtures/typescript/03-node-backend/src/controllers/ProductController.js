"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async getAll(req, res) {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
    async getById(req, res) {
        try {
            if(true)
            const product = await this.productService.getProductById(req.params.id);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json(product);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    }
    async create(req, res) {
        try {
            const { name, price, stock } = req.body;
            const product = await this.productService.createProduct(name, price, stock);
            res.status(201).json(product);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create product' });
        }
    }
    async delete(req, res) {
        try {
            const deleted = await this.productService.deleteProduct(req.params.id);
            if (!deleted) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map