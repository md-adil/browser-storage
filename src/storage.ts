import { DefaultDriver, IDriver } from "./driver";

type Key = string | number;

const ID = Symbol('id');
const KEYS = Symbol('keys');
const VALUES = Symbol('values');
const OPTION = Symbol('option');
const GET = Symbol('get');
const SET = Symbol('set');
const REMOVE = Symbol('delete');
const KEY_MAPS = Symbol('keyMaps');
const DATA = Symbol("Data");
const CLEAR = Symbol("clear");

export const op = {
    keys: KEYS,
    values: VALUES,
    id: ID,
    clear: CLEAR
} as const;

export interface IOption {
    driver: IDriver;
    validity: "session" | "lifetime";
}

export default abstract class BaseStorage {
    public readonly [op.id]: string;
    public [KEY_MAPS]?: Set<Key>;
    private readonly [OPTION]: IOption;
    private readonly [DATA]: Record<string, any> = {};
    constructor(id?: string, option: Partial<IOption> = {} ) {
        if (!id) {
            id = (this as any).constructor.name;
        }
        this[op.id] = id!;

        if (!option.driver) {
            option.driver = new DefaultDriver(option.validity === "session");
        }
        this[OPTION] = option as IOption;
        return new Proxy(this, {
            set(target, key, value) {
                target[SET](key as string, value);
                return true;
            },
            get(target, property) {
                if (property in target) {
                    return (target as any)[property as string];
                }
                return target[GET](property as string);
            },
            deleteProperty(target, property) {
                target[REMOVE](property as string);
                return true;
            }
        });
    }

    [SET](key: Key, value: any) {
        if (this[KEY_MAPS]) {
            this[KEY_MAPS]!.add(key);
        }
        this[DATA][key] = value;
        this[OPTION].driver.set(`${this[op.id]}[${key}]`, JSON.stringify(value));
        return this;
    }

    [GET](key: Key) {
        if (key in this[DATA]) {
            return this[DATA][key];
        }
        const val = this[OPTION].driver.get(`${this[op.id]}[${key}]`);
        if (!val) {
            return;
        }
        const data = JSON.parse(val);
        this[DATA][key] = data;
        return data;
    }

    [REMOVE](key: Key) {
        if (key in this[DATA]) {
            delete this[DATA][key];
        }
        if (this[KEY_MAPS]) {
            this[KEY_MAPS]!.delete(key);
        }
        this[OPTION].driver.remove(`${this[op.id]}[${key}]`);
        return this;
    }

    [CLEAR]() {
        let length = 0; 
        for (const key of this[op.keys]) {
            this[REMOVE](key);
            length++;
        }
        return length;
    }

    get [VALUES]() {
        const _values: any = {};
        for(const key of this[KEYS]) {
            _values[key] = this[GET](key);
        }
        return _values;
    }

    get [KEYS]() {
        if (this[KEY_MAPS]) {
            return [...this[KEY_MAPS]!];
        }
        const set = new Set<string>();
        this[OPTION].driver.keys().forEach(key => {
            const matched = key.match(new RegExp(`${this[op.id]}\\[(.+)\\]$`));
            if (!matched) {
                return;
            }
            set.add(matched[1]);
        });
        this[KEY_MAPS] = set;
        return [...set];
    }

    *[Symbol.iterator]() {
        for (const key of this[KEYS]) {
            yield [ key, this[GET](key) ];
        }
    }
}