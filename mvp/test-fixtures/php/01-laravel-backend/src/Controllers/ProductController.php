<?php

namespace App\Controllers;

use App\Services\ProductService;
use App\Models\Product;

/**
 * Laravel-style controller for product endpoints
 */
class ProductController
{
    private ProductService $productService;
    
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    
    /**
     * GET /products - Get all products
     */
    public function index(): array
    {
        $products = $this->productService->getAllProducts();
        return [
            'products' => array_map(fn($p) => $p->toArray(), $products),
            'count' => count($products)
        ];
    }
    
    /**
     * GET /products/{id} - Get product by ID
     */
    public function show(int $id): array
    {
        $product = $this->productService->getProductById($id);
        if ($product) {
            return ['product' => $product->toArray()];
        }
        return ['error' => 'Product not found'];
    }
    
    /**
     * POST /products - Create new product
     */
    public function store(array $data): array
    {
        $product = $this->productService->createProduct(
            $data['name'],
            $data['price'],
            $data['description'] ?? "",
            $data['stock'] ?? 0
        );
        return [
            'product' => $product->toArray(),
            'message' => 'Product created successfully'
        ];
    }
    
    /**
     * PATCH /products/{id}/stock - Update product stock
     */
    public function updateStock(int $id, int $quantity): array
    {
        $product = $this->productService->updateProductStock($id, $quantity);
        if ($product) {
            return [
                'product' => $product->toArray(),
                'message' => 'Stock updated successfully'
            ];
        }
        return ['error' => 'Product not found'];
    }
    
    /**
     * DELETE /products/{id} - Delete product
     */
    public function destroy(int $id): array
    {
        $success = $this->productService->deleteProduct($id);
        if ($success) {
            return ['message' => 'Product deleted successfully'];
        }
        return ['error' => 'Product not found'];
    }
    
    /**
     * GET /products/available - Get available products
     */
    public function available(): array
    {
        $products = $this->productService->getAvailableProducts();
        return [
            'products' => array_map(fn($p) => $p->toArray(), $products),
            'count' => count($products)
        ];
    }
}
