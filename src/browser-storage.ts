class AnyValue {
    [key: string]: any;
    value = "any value from parent";
}

type Key = string | number;

class BrowserStorage<T> {
    public readonly _keyMaps = new Map<Key, true>();
    constructor(public readonly id: string = BrowserStorage.name, private iterable = false) {
        if (iterable) {
            let keys: any = localStorage.getItem(`${id}.keys`);
            if (keys) {
                keys = JSON.parse(keys);
                keys.forEach((val: string) => {
                    this._keyMaps.set(val, true)
                });
            }
        }
        return new Proxy(this, {
            set(target, key, value) {
                target.set(key as string, value);
                return true;
            },
            get(target, property) {
                if (property in target) {
                    return (target as any)[property as string];
                }
                return target.get(property as string);
            },
            deleteProperty(target, property) {
                target.delete(property as string);
                return true;
            }
        });
    }

    private updateKeys() {
        localStorage.setItem(`${this.id}.keys`, JSON.stringify([...this._keyMaps.keys()]));
    }

    set(key: Key, value: T) {
        if (this.iterable && !this._keyMaps.has(key)) {
            this._keyMaps.set(key, true);
            this.updateKeys();
        }
       localStorage.setItem(`${this.id}[${key}]`, JSON.stringify(value));
       return this;
    }

    get(key: Key, def?: T) {
        if (this.iterable && !this._keyMaps.has(key)) {
            return def;
        }
        const val = localStorage.getItem(`${this.id}[${key}]`);
        if (!val) {
            return def;
        }
        return JSON.parse(val);
    }

    delete(key: Key) {
        if (this.iterable && this._keyMaps.has(key)) {
            this._keyMaps.delete(key);
            this.updateKeys();
        }
        localStorage.removeItem(`${this.id}[${key}]`);
        return this;
    }

    values() {
        if (!this.iterable) {
            throw new Error("Can't get values, dataset is not iterable");
        }
        const values: any = {};
        for(const key of this._keyMaps.keys()) {
            values[key] = this.get(key);
        }
        return values;
    }

    [Symbol.iterator]() {
        const keys = this._keyMaps.keys();
        const that = this;
        return {
            next() {
                let key = keys.next()
                if (!key.done) {
                    return { value: [ key.value, that.get(key.value) ], done: false }
                }
                return { value: null, done: true }
            }
        }
    }
}

export default BrowserStorage;