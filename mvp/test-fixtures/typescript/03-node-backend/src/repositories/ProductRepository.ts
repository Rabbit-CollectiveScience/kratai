import { Product } from '../models/Product';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async create(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) return null;

    Object.assign(product, updates);
    return product;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}
