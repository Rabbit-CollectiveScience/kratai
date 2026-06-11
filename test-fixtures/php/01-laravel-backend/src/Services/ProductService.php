<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductRepository;

/**
 * Business logic for product operations
 */
class ProductService
{
    private ProductRepository $repository;
    
    public function __construct(ProductRepository $repository)
    {
        $this->repository = $repository;
    }
    
    public function getAllProducts(): array
    {
        return $this->repository->findAll();
    }
    
    public function getProductById(int $productId): ?Product
    {
        return $this->repository->findById($productId);
    }
    
    public function createProduct(
        string $name,
        float $price,
        string $description = "",
        int $stock = 0
    ): Product {
        $product = new Product(0, $name, $price, $description, $stock);
        return $this->repository->save($product);
    }
    
    public function updateProductStock(int $productId, int $quantity): ?Product
    {
        $product = $this->repository->findById($productId);
        if ($product) {
            $product->updateStock($quantity);
            return $this->repository->save($product);
        }
        return null;
    }
    
    public function deleteProduct(int $productId): bool
    {
        return $this->repository->delete($productId);
    }
    
    public function getAvailableProducts(): array
    {
        $allProducts = $this->repository->findAll();
        return array_filter($allProducts, fn($p) => $p->isAvailable());
    }
    
    public function applyDiscountToProduct(int $productId, float $percentage): ?float
    {
        $product = $this->repository->findById($productId);
        if ($product) {
            return $product->applyDiscount($percentage);
        }
        return null;
    }
}
