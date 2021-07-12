"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDriver = void 0;
const nullStorage = {
    setItem() {
        console.warn('Storage not supported');
    },
    getItem() {
        console.warn('Storage not supported');
    },
    removeItem() {
        console.warn('Storage not supported');
    }
};
class DefaultDriver {
    constructor(temp = false) {
        if (typeof localStorage === "undefined") {
            this.engine = nullStorage;
        }
        else if (temp) {
            this.engine = sessionStorage;
        }
        else {
            this.engine = localStorage;
        }
    }
    get(key) {
        return this.engine.getItem(key);
    }
    set(key, value) {
        this.engine.setItem(key, value);
        return this;
    }
    remove(key) {
        this.engine.removeItem(key);
        return this;
    }
    *keys() {
        for (const i in this.engine) {
            if (!Object.prototype.hasOwnProperty.call(this.engine, i)) {
                continue;
            }
            yield i;
        }
    }
}
exports.DefaultDriver = DefaultDriver;
