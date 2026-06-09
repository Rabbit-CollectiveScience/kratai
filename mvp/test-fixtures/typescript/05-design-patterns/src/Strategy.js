"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessor = exports.CryptoPayment = exports.PayPalPayment = exports.CreditCardPayment = void 0;
class CreditCardPayment {
    cardNumber;
    constructor(cardNumber) {
        this.cardNumber = cardNumber;
    }
    pay(amount) {
        console.log(`Paid $${amount} with credit card ending in ${this.cardNumber.slice(-4)}`);
    }
}
exports.CreditCardPayment = CreditCardPayment;
class PayPalPayment {
    email;
    constructor(email) {
        this.email = email;
    }
    pay(amount) {
        console.log(`Paid $${amount} via PayPal to ${this.email}`);
    }
}
exports.PayPalPayment = PayPalPayment;
class CryptoPayment {
    walletAddress;
    constructor(walletAddress) {
        this.walletAddress = walletAddress;
    }
    pay(amount) {
        console.log(`Paid $${amount} in crypto to ${this.walletAddress}`);
    }
}
exports.CryptoPayment = CryptoPayment;
class PaymentProcessor {
    strategy;
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    processPayment(amount) {
        this.strategy.pay(amount);
    }
}
exports.PaymentProcessor = PaymentProcessor;
//# sourceMappingURL=Strategy.js.map