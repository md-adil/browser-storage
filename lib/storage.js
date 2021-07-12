"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.op = void 0;
const driver_1 = require("./driver");
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
exports.op = {
    keys: KEYS,
    values: VALUES,
    id: ID,
    clear: CLEAR,
    update: UPDATE,
    replace: REPLACE
};
class BaseStorage {
    constructor(id, option = {}) {
        this[_a] = {};
        this[_b] = new Set();
        this[_c] = false;
        if (!id) {
            id = this.constructor.name;
        }
        this[exports.op.id] = id;
        if (!option.driver) {
            option.driver = new driver_1.DefaultDriver(option.validity === "session");
        }
        this[OPTION] = option;
        return new Proxy(this, {
            set(target, key, value) {
                target[SET](key, value);
                return true;
            },
            get(target, property) {
                if (property in target) {
                    return target[property];
                }
                return target[GET](property);
            },
            deleteProperty(target, property) {
                target[REMOVE](property);
                return true;
            }
        });
    }
    static keys(instance) {
        return instance[exports.op.keys];
    }
    static clear(instance) {
        return instance[exports.op.clear];
    }
    static values(instance) {
        return instance[exports.op.clear];
    }
    static update(instance, data) {
        instance[exports.op.update] = data;
    }
    static id(instance) {
        return instance[ID];
    }
    set [(_a = DATA, _b = DIRTY, _c = PENDING, UPDATE)](value) {
        for (const key in value) {
            this[SET](key, value);
        }
    }
    set [REPLACE](value) {
        this[CLEAR];
        this[UPDATE] = value;
    }
    [SET](key, value) {
        this[DATA][key] = value;
        this[DIRTY].add(key);
        if (this[PENDING]) {
            return this;
        }
        this[PENDING] = true;
        setTimeout(() => {
            for (const dirty of this[DIRTY]) {
                this[OPTION].driver.set(`${this[exports.op.id]}[${dirty}]`, JSON.stringify(this[DATA][dirty]));
            }
            this[PENDING] = false;
            this[DIRTY].clear();
        }, 0);
        return this;
    }
    [GET](key) {
        if (key in this[DATA]) {
            return this[DATA][key];
        }
        const val = this[OPTION].driver.get(`${this[exports.op.id]}[${key}]`);
        if (!val) {
            return;
        }
        const data = JSON.parse(val);
        this[DATA][key] = data;
        return data;
    }
    [REMOVE](key) {
        if (key in this[DATA]) {
            delete this[DATA][key];
        }
        this[DIRTY].delete(key);
        this[OPTION].driver.remove(`${this[exports.op.id]}[${key}]`);
        return this;
    }
    get [CLEAR]() {
        let length = 0;
        for (const key of this[exports.op.keys]) {
            this[REMOVE](key);
            length++;
        }
        return length;
    }
    get [VALUES]() {
        const _values = {};
        for (const [key, value] of this) {
            _values[key] = value;
        }
        return _values;
    }
    get [KEYS]() {
        return [...getKeys(this[ID], this[DATA], this[OPTION].driver)];
    }
    *[Symbol.iterator]() {
        for (const key of getKeys(this[ID], this[DATA], this[OPTION].driver)) {
            yield [key, this[GET](key)];
        }
    }
}
exports.default = BaseStorage;
function* getKeys(id, data, driver) {
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
