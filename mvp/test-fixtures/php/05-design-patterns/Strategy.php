<?php

interface PaymentStrategy
{
    public function pay(float $amount): void;
}

class CreditCardPayment implements PaymentStrategy
{
    private string $cardNumber;

    public function __construct(string $cardNumber)
    {
        $this->cardNumber = $cardNumber;
    }

    public function pay(float $amount): void
    {
        $lastFour = substr($this->cardNumber, -4);
        echo "Paid $" . number_format($amount, 2) . " with credit card ending in {$lastFour}\n";
    }
}

class PayPalPayment implements PaymentStrategy
{
    private string $email;

    public function __construct(string $email)
    {
        $this->email = $email;
    }

    public function pay(float $amount): void
    {
        echo "Paid $" . number_format($amount, 2) . " via PayPal to {$this->email}\n";
    }
}

class CryptoPayment implements PaymentStrategy
{
    private string $walletAddress;

    public function __construct(string $walletAddress)
    {
        $this->walletAddress = $walletAddress;
    }

    public function pay(float $amount): void
    {
        echo "Paid $" . number_format($amount, 2) . " in crypto to {$this->walletAddress}\n";
    }
}

class PaymentProcessor
{
    private PaymentStrategy $strategy;

    public function __construct(PaymentStrategy $strategy)
    {
        $this->strategy = $strategy;
    }

    public function setStrategy(PaymentStrategy $strategy): void
    {
        $this->strategy = $strategy;
    }

    public function processPayment(float $amount): void
    {
        $this->strategy->pay($amount);
    }
}
