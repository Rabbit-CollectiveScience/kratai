export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

export class Product implements IProduct {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public stock: number,
    public createdAt: Date = new Date()
  ) {}

  updateStock(quantity: number): void {
    this.stock += quantity;
  }

  isAvailable(): boolean {
    return this.stock > 0;
  }
}
