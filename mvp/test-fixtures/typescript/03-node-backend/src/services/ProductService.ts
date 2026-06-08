import { Product } from '../models/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class ProductService {
  constructor(private repository: ProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async createProduct(name: string, price: number, stock: number): Promise<Product> {
    const product = new Product(this.generateId(), name, price, stock);
    return this.repository.create(product);
  }

  async updateProductStock(id: string, quantity: number): Promise<Product | null> {
    const product = await this.repository.findById(id);
    if (!product) return null;

    product.updateStock(quantity);
    return this.repository.update(id, product);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  private generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
