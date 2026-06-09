from typing import List, Optional
from ..models.Product import Product, ProductRepository


class ProductService:
    """Business logic for product operations"""
    
    def __init__(self, repository: ProductRepository):
        self.repository = repository
    
    def get_all_products(self) -> List[Product]:
        """Get all products"""
        return self.repository.find_all()
    
    def get_product_by_id(self, product_id: int) -> Optional[Product]:
        """Get product by ID"""
        return self.repository.find_by_id(product_id)
    
    def create_product(self, name: str, price: float, description: str = "", stock: int = 0) -> Product:
        """Create new product"""
        product = Product(0, name, price, description, stock)
        return self.repository.save(product)
    
    def update_product_stock(self, product_id: int, quantity: int) -> Optional[Product]:
        """Update product stock"""
        product = self.repository.find_by_id(product_id)
        if product:
            product.update_stock(quantity)
            return self.repository.save(product)
        return None
    
    def delete_product(self, product_id: int) -> bool:
        """Delete product"""
        return self.repository.delete(product_id)
    
    def get_available_products(self) -> List[Product]:
        """Get all available products (in stock)"""
        all_products = self.repository.find_all()
        return [p for p in all_products if p.is_available()]
    
    def apply_discount_to_product(self, product_id: int, percentage: float) -> Optional[float]:
        """Apply discount to product and return new price"""
        product = self.repository.find_by_id(product_id)
        if product:
            return product.apply_discount(percentage)
        return None
