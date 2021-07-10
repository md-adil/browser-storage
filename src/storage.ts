import { DefaultDriver, IDriver } from "./driver";

type Key = string | number;
type Value = any;

export const keys = Symbol('keys');
export const values = Symbol('values');
const optionKey = Symbol('option');
const get = Symbol('get');
const set = Symbol('set');
const remove = Symbol('delete');
export const idKey = Symbol('id');
const keyMaps = Symbol('keyMaps');
const dataKey = Symbol("Data");
const updateKeysKey = Symbol('updateKeys');

export interface IOption {
    driver: IDriver;
    iterable: boolean;
    validity: "session" | "lifetime";
}

export default abstract class Storage {
    public readonly [idKey]: string;
    public readonly [keyMaps] = new Set<Key>();
    private readonly [optionKey]: IOption;
    private readonly [dataKey]: Record<string, any> = {};
    constructor(id?: string, option: Partial<IOption> | boolean = {} ) {
        if (!id) {
            id = (this as any).constructor.name;
        }
        this[idKey] = id!;
        if (typeof option === "boolean") {
            option = { iterable: option };
        }
        if (!option.driver) {
            option.driver = new DefaultDriver(option.validity === "session");
        }
        if (!("iterable" in option)) {
            option.iterable = false;
        }
        this[optionKey] = option as IOption;
        if (option.iterable) {
            let keys: any = option.driver.get(`${id}.keys`);
            if (keys) {
                keys = JSON.parse(keys);
                keys.forEach((val: string) => {
                    this[keyMaps].add(val)
                });
            }
        }
        return new Proxy(this, {
            set(target, key, value) {
                target[set](key as string, value);
                return true;
            },
            get(target, property) {
                if (property in target) {
                    return (target as any)[property as string];
                }
                return target[get](property as string);
            },
            deleteProperty(target, property) {
                target[remove](property as string);
                return true;
            }
        });
    }

    private [updateKeysKey]() {
        const id = this[idKey];
        this[optionKey].driver.set(`${id}.keys`, JSON.stringify([...this[keyMaps].keys()]))
    }

    [set](key: Key, value: Value) {
        if (this[optionKey].iterable && !this[keyMaps].has(key)) {
            this[keyMaps].add(key);
            this[updateKeysKey]();
        }
       this[optionKey].driver.set(`${this[idKey]}[${key}]`, JSON.stringify(value));
       return this;
    }

    [get](key: Key, def?: any) {
        if (key in this[dataKey]) {
            return this[dataKey][key];
        }
        if (this[optionKey].iterable && !this[keyMaps].has(key)) {
            return def;
        }
        const val = this[optionKey].driver.get(`${this[idKey]}[${key}]`);
        if (!val) {
            return def;
        }
        return JSON.parse(val);
    }

    [remove](key: Key) {
        if (this[optionKey].iterable && this[keyMaps].has(key)) {
            this[keyMaps].delete(key);
            this[updateKeysKey]();
        }
        this[optionKey].driver.remove(`${this[idKey]}[${key}]`);
        return this;
    }

    get [values]() {
        if (!this[optionKey].iterable) {
            throw new Error("Can't get values, dataset is not iterable");
        }
        const _values: any = {};
        for(const key of this[keyMaps].values()) {
            _values[key] = this[get](key);
        }
        return _values;
    }

    get [keys]() {
        if (!this[optionKey].iterable) {
            throw new Error("Can't get values, dataset is not iterable");
        }
        return [...this[keyMaps]];
    }

    *[Symbol.iterator]() {
        for (const key of this[keyMaps]) {
            yield [ key, this[get](key) ];
        }
    }
}