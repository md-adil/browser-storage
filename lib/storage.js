"use strict";
var _a;
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
const KEY_MAPS = Symbol('keyMaps');
const DATA = Symbol("Data");
const CLEAR = Symbol("clear");
exports.op = {
    keys: KEYS,
    values: VALUES,
    id: ID,
    clear: CLEAR
};
class BaseStorage {
    constructor(id, option = {}) {
        this[_a] = {};
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
    [(exports.op.id, _a = DATA, SET)](key, value) {
        if (this[KEY_MAPS]) {
            this[KEY_MAPS].add(key);
        }
        this[DATA][key] = value;
        this[OPTION].driver.set(`${this[exports.op.id]}[${key}]`, JSON.stringify(value));
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
        if (this[KEY_MAPS]) {
            this[KEY_MAPS].delete(key);
        }
        this[OPTION].driver.remove(`${this[exports.op.id]}[${key}]`);
        return this;
    }
    [CLEAR]() {
        let length = 0;
        for (const key of this[exports.op.keys]) {
            this[REMOVE](key);
            length++;
        }
        return length;
    }
    get [VALUES]() {
        const _values = {};
        for (const key of this[KEYS]) {
            _values[key] = this[GET](key);
        }
        return _values;
    }
    get [KEYS]() {
        if (this[KEY_MAPS]) {
            return [...this[KEY_MAPS]];
        }
        const set = new Set();
        this[OPTION].driver.keys().forEach(key => {
            const matched = key.match(new RegExp(`${this[exports.op.id]}\\[(.+)\\]$`));
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
            yield [key, this[GET](key)];
        }
    }
}
exports.default = BaseStorage;
