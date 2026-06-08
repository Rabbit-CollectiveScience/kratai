export interface IPaymentStrategy {
  pay(amount: number): void;
}

export class CreditCardPayment implements IPaymentStrategy {
  constructor(private cardNumber: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} with credit card ending in ${this.cardNumber.slice(-4)}`);
  }
}

export class PayPalPayment implements IPaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} via PayPal to ${this.email}`);
  }
}

export class CryptoPayment implements IPaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} in crypto to ${this.walletAddress}`);
  }
}

export class PaymentProcessor {
  private strategy: IPaymentStrategy;

  constructor(strategy: IPaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IPaymentStrategy): void {
    this.strategy = strategy;
  }

  processPayment(amount: number): void {
    this.strategy.pay(amount);
  }
}
