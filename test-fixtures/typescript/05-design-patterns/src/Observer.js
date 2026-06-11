"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotifier = exports.Logger = exports.EventEmitter = void 0;
class EventEmitter {
    observers = [];
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}
exports.EventEmitter = EventEmitter;
class Logger {
    update(data) {
        console.log(`[Logger] Event received:`, data);
    }
}
exports.Logger = Logger;
class EmailNotifier {
    update(data) {
        console.log(`[EmailNotifier] Sending email for:`, data);
    }
}
exports.EmailNotifier = EmailNotifier;
//# sourceMappingURL=Observer.js.map