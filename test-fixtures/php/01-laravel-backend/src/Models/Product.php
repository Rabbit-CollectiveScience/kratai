<?php

namespace App\Models;

use DateTime;

/**
 * Product model representing an item in the catalog
 */
class Product
{
    private int $id;
    private string $name;
    private string $description;
    private float $price;
    private int $stock;
    private DateTime $createdAt;
    
    public function __construct(
        int $id,
        string $name,
        float $price,
        string $description = "",
        int $stock = 0
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->price = $price;
        $this->stock = $stock;
        $this->createdAt = new DateTime();
    }
    
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'created_at' => $this->createdAt->format('Y-m-d H:i:s')
        ];
    }
    
    public function updateStock(int $quantity): void
    {
        $this->stock += $quantity;
    }
    
    public function isAvailable(): bool
    {
        return $this->stock > 0;
    }
    
    public function applyDiscount(float $percentage): float
    {
        $discount = $this->price * ($percentage / 100);
        return $this->price - $discount;
    }
    
    public function getId(): int
    {
        return $this->id;
    }
    
    public function getName(): string
    {
        return $this->name;
    }
    
    public function getPrice(): float
    {
        return $this->price;
    }
}

/**
 * Repository for Product data access
 */
class ProductRepository
{
    private array $products = [];
    private int $nextId = 1;
    
    public function findById(int $id): ?Product
    {
        return $this->products[$id] ?? null;
    }
    
    public function findAll(): array
    {
        return array_values($this->products);
    }
    
    public function save(Product $product): Product
    {
        if ($product->getId() === 0) {
            $this->nextId++;
        }
        $this->products[$product->getId()] = $product;
        return $product;
    }
    
    public function delete(int $id): bool
    {
        if (isset($this->products[$id])) {
            unset($this->products[$id]);
            return true;
        }
        return false;
    }
}
