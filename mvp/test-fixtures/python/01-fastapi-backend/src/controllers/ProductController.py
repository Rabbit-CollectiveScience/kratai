from typing import List, Optional
from ..services.ProductService import ProductService
from ..models.Product import Product


class ProductController:
    """FastAPI controller for product endpoints"""
    
    def __init__(self, product_service: ProductService):
        self.product_service = product_service
    
    def get_all(self) -> dict:
        """GET /products - Get all products"""
        products = self.product_service.get_all_products()
        return {
            'products': [p.to_dict() for p in products],
            'count': len(products)
        }
    
    def get_by_id(self, product_id: int) -> dict:
        """GET /products/{id} - Get product by ID"""
        product = self.product_service.get_product_by_id(product_id)
        if product:
            return {'product': product.to_dict()}
        return {'error': 'Product not found'}, 404
    
    def create(self, name: str, price: float, description: str = "", stock: int = 0) -> dict:
        """POST /products - Create new product"""
        product = self.product_service.create_product(name, price, description, stock)
        return {
            'product': product.to_dict(),
            'message': 'Product created successfully'
        }
    
    def update_stock(self, product_id: int, quantity: int) -> dict:
        """PATCH /products/{id}/stock - Update product stock"""
        product = self.product_service.update_product_stock(product_id, quantity)
        if product:
            return {
                'product': product.to_dict(),
                'message': 'Stock updated successfully'
            }
        return {'error': 'Product not found'}, 404
    
    def delete(self, product_id: int) -> dict:
        """DELETE /products/{id} - Delete product"""
        success = self.product_service.delete_product(product_id)
        if success:
            return {'message': 'Product deleted successfully'}
        return {'error': 'Product not found'}, 404
    
    def get_available(self) -> dict:
        """GET /products/available - Get available products"""
        products = self.product_service.get_available_products()
        return {
            'products': [p.to_dict() for p in products],
            'count': len(products)
        }
