import { DefaultDriver, IDriver } from "./driver";

type Key = string | number;

const ID = Symbol('id');
const KEYS = Symbol('keys');
const VALUES = Symbol('values');
const OPTION = Symbol('option');
const GET = Symbol('get');
const SET = Symbol('set');
const REMOVE = Symbol('delete');
const DATA = Symbol("data");
const CLEAR = Symbol("clear");
const DIRTY = Symbol('dirty');
const PENDING = Symbol('pending');
const UPDATE = Symbol('pending');
const REPLACE = Symbol('replace');

export const op = {
    keys: KEYS,
    values: VALUES,
    id: ID,
    clear: CLEAR,
    update: UPDATE,
    replace: REPLACE
} as const;

export interface IOption {
    driver: IDriver;
    validity: "session" | "lifetime";
}

export default abstract class BaseStorage {
    static keys(instance: BaseStorage) {
        return instance[op.keys];
    }
    static clear(instance: BaseStorage) {
        return instance[op.clear];
    }
    static values(instance: BaseStorage) {
        return instance[op.clear];
    }
    static update(instance: BaseStorage, data: object) {
        instance[op.update] = data;
    }
    static id(instance: BaseStorage) {
        return instance[ID];
    }
    public readonly [ID]: string;
    private readonly [OPTION]: IOption;
    private readonly [DATA]: Record<string, any> = {};
    private readonly [DIRTY] = new Set<Key>();
    private [PENDING] = false;
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
                    return (target as any)[property];
                }
                return target[GET](property as string);
            },
            deleteProperty(target, property) {
                target[REMOVE](property as string);
                return true;
            }
        });
    }

    set [UPDATE](value: Record<Key, any>) {
        for (const key in value) {
            this[SET](key, value);
        }
    }

    set [REPLACE](value: Record<Key, any>) {
        this[CLEAR];
        this[UPDATE] = value;
    }

    [SET](key: Key, value: any) {
        this[DATA][key] = value;
        this[DIRTY].add(key);

        if (this[PENDING]) {
            return this;
        }
        this[PENDING] = true;
        setTimeout(() => {
            for (const dirty of this[DIRTY]) {
                this[OPTION].driver.set(`${this[op.id]}[${dirty}]`, JSON.stringify(this[DATA][dirty]));
            }
            this[PENDING] = false
            this[DIRTY].clear();
        }, 0)
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
        this[DIRTY].delete(key);
        this[OPTION].driver.remove(`${this[op.id]}[${key}]`);
        return this;
    }

    get [CLEAR]() {
        let length = 0; 
        for (const key of this[op.keys]) {
            this[REMOVE](key);
            length++;
        }
        return length;
    }

    get [VALUES]() {
        const _values: any = {};
        for(const [key, value] of this) {
            _values[key] = value;
        }
        return _values;
    }

    get [KEYS]() {
        return [...getKeys(this[ID], this[DATA], this[OPTION].driver)];
    }

    *[Symbol.iterator]() {
        for (const key of getKeys(this[ID], this[DATA], this[OPTION].driver)) {
            yield [ key, this[GET](key) ];
        }
    }
}

function * getKeys(id: string, data: object, driver: IDriver) {
    for (const key in data) {
        yield key;
    }
    for (const i of driver.keys()) {
        const matched = i.match(new RegExp(`${id}\\[(.+)\\]$`));
        if (!matched) {
            return;
        }
        const key = matched[1];
        if (!key) {
            continue;
        }
        if (key in data) {
            continue;
        }
        yield key;
    }
}
