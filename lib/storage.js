"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
const ID = Symbol('id');
const OPTION = Symbol('option');
const GET = Symbol('get');
const SET = Symbol('set');
const REMOVE = Symbol('remove');
const DATA = Symbol("data");
const DIRTY = Symbol('dirty');
const PENDING = Symbol('pending');
function isOwn(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
class BaseStorage {
    constructor(id, option = {}) {
        this[_a] = {};
        this[_b] = {
            remove: new Set(),
            update: new Set()
        };
        this[_c] = {
            remove: false,
            update: false
        };
        if (!id) {
            id = getId(this.constructor.name);
        }
        this[ID] = id;
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
    static *keys(instance) {
        const data = instance[DATA];
        const id = instance[ID];
        const driver = instance[OPTION].driver;
        for (const key in data) {
            yield key;
        }
        for (const i of driver.keys()) {
            const matched = i.match(new RegExp(`${id}\\[(.+)\\]$`));
            if (!matched) {
                continue;
            }
            const key = matched[1];
            if (!key) {
                continue;
            }
            if (key in data || instance[DIRTY].remove.has(key)) {
                continue;
            }
            yield key;
        }
    }
    static driver(instance) {
        return instance[OPTION].driver;
    }
    static clear(instance) {
        let count = 0;
        for (const key of this.keys(instance)) {
            instance[REMOVE](key);
            count++;
        }
        return count;
    }
    static savePending(instance) {
        for (const dirty of instance[DIRTY].update) {
            const key = `${instance[ID]}[${dirty}]`, value = instance[DATA][dirty];
            if (typeof value === "undefined") {
                instance[OPTION].driver.remove(key);
                continue;
            }
            instance[OPTION].driver.set(key, JSON.stringify(value));
        }
        instance[PENDING].update = false;
        instance[DIRTY].update.clear();
    }
    static clearCache(instance) {
        this.savePending(instance);
        for (const i in instance[DATA]) {
            delete instance[DATA][i];
        }
        return instance;
    }
    static values(instance) {
        const values = {};
        for (const [key, val] of instance) {
            values[key] = val;
        }
        return values;
    }
    static update(instance, data, value) {
        if (typeof data === "string") {
            return this.update(instance, { [data]: value });
        }
        for (const o in data) {
            if (!isOwn(data, o)) {
                continue;
            }
            instance[SET](o, data[o]);
        }
        return instance;
    }
    static set(instance, data) {
        this.clear(instance);
        this.update(instance, data);
    }
    static id(instance) {
        return instance[ID];
    }
    [(_a = DATA, _b = DIRTY, _c = PENDING, SET)](key, value) {
        this[DATA][key] = value;
        this[DIRTY].update.add(key);
        if (this[PENDING].update) {
            return this;
        }
        this[PENDING].update = true;
        setTimeout(() => {
            BaseStorage.savePending(this);
        }, 0);
        return this;
    }
    [GET](key) {
        if (key in this[DATA]) {
            return this[DATA][key];
        }
        const val = this[OPTION].driver.get(`${this[ID]}[${key}]`);
        if (!val) {
            return;
        }
        try {
            const data = JSON.parse(val);
            this[DATA][key] = data;
            return data;
        }
        catch (e) {
            return;
        }
    }
    [REMOVE](key) {
        this[DIRTY].update.delete(key);
        this[DIRTY].remove.add(key);
        if (key in this[DATA]) {
            delete this[DATA][key];
        }
        if (this[PENDING].remove) {
            return this;
        }
        this[PENDING].remove = true;
        setTimeout(() => {
            for (const i of this[DIRTY].remove) {
                this[OPTION].driver.remove(`${this[ID]}[${i}]`);
            }
            this[DIRTY].remove.clear();
            this[PENDING].remove = false;
        }, 0);
        return this;
    }
    toJSON() {
        return BaseStorage.values(this);
    }
    *[Symbol.iterator]() {
        for (const key of BaseStorage.keys(this)) {
            yield [key, this[GET](key)];
        }
    }
}
exports.default = BaseStorage;
function getId(name, n = 8) {
    let code = '';
    for (let i = 0; i < name.length; i++) {
        code += name.charCodeAt(i);
    }
    return Number(code).toString(16).substr(0, n);
}
