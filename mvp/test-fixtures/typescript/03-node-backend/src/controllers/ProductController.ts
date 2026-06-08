import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  constructor(private productService: ProductService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, price, stock } = req.body;
      const product = await this.productService.createProduct(name, price, stock);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.productService.deleteProduct(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}
