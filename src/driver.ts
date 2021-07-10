export interface IDriver {
    set(key: string, value: string): this;
    get(key: string): string | null;
    remove(key: string): this;
    keys(): string[];
}

const nullStorage: Storage = {
    setItem() {
        console.warn('Storage not supported');
    },
    getItem() {
        console.warn('Storage not supported');
    },
    removeItem() {
        console.warn('Storage not supported');
    }
} as any;

export class DefaultDriver implements IDriver {
    private readonly engine: Storage;
    constructor(temp: boolean = false) {
        if (typeof localStorage === "undefined") {
            this.engine = nullStorage;
        } else if (temp) {
            this.engine = sessionStorage;
        } else {
            this.engine = localStorage;
        }
    }

    get(key: string) {
        return this.engine.getItem(key);
    }

    set(key: string, value: string) {
        this.engine.setItem(key, value);
        return this;
    }

    remove(key: string) {
        this.engine.removeItem(key);
        return this;
    }

    keys() {
        return Object.keys(this.engine); 
    }
}