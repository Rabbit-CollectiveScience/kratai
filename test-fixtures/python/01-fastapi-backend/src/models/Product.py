from typing import Optional
from datetime import datetime


class Product:
    """Product model representing an item in the catalog"""
    
    id: int
    name: str
    description: str
    price: float
    stock: int
    created_at: datetime
    
    def __init__(self, id: int, name: str, price: float, description: str = "", stock: int = 0):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.stock = stock
        self.created_at = datetime.now()
    
    def to_dict(self) -> dict:
        """Convert product to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'stock': self.stock,
            'created_at': self.created_at.isoformat()
        }
    
    def update_stock(self, quantity: int) -> None:
        """Update product stock"""
        self.stock += quantity
    
    def is_available(self) -> bool:
        """Check if product is in stock"""
        return self.stock > 0
    
    def apply_discount(self, percentage: float) -> float:
        """Apply discount and return new price"""
        discount = self.price * (percentage / 100)
        return self.price - discount


class ProductRepository:
    """Repository for Product data access"""
    
    def __init__(self):
        self.products = {}
        self.next_id = 1
    
    def find_by_id(self, id: int) -> Optional[Product]:
        """Find product by ID"""
        return self.products.get(id)
    
    def find_all(self) -> list:
        """Get all products"""
        return list(self.products.values())
    
    def save(self, product: Product) -> Product:
        """Save product to repository"""
        if product.id == 0:
            product.id = self.next_id
            self.next_id += 1
        self.products[product.id] = product
        return product
    
    def delete(self, id: int) -> bool:
        """Delete product by ID"""
        if id in self.products:
            del self.products[id]
            return True
        return False
