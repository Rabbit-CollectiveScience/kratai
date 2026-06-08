export interface IObserver {
  update(data: any): void;
}

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(data: any): void;
}

export class EventEmitter implements ISubject {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    this.observers.push(observer);
  }

  detach(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

export class Logger implements IObserver {
  update(data: any): void {
    console.log(`[Logger] Event received:`, data);
  }
}

export class EmailNotifier implements IObserver {
  update(data: any): void {
    console.log(`[EmailNotifier] Sending email for:`, data);
  }
}
