import { BaseStorage, IDriver, op } from "../";

class Test extends BaseStorage {
    [key: string]: any;
}

beforeEach(() => {
    new Test()[op.clear]()
})

test("id", () => {
    const storage = new Test();
    expect(storage[op.id]).toBe("Test");
    const storage2 = new Test('test2');
    expect(storage2[op.id]).toBe("test2");
});

test("setting/getting", () => {
    const storage = new Test();
    storage.name = "Hello";
    expect(storage.name).toBe("Hello");
});

test("keys", () => {
    const storage = new Test();
    storage.name = "Hello";
    expect(storage[op.keys]).toEqual(["name"]);
    const storage2 = new Test();
    expect(storage2[op.keys]).toEqual(["name"]);
});

test("values", () => {
    const storage = new Test();
    storage.name = "Hello";
    expect(storage[op.values]).toEqual({name: "Hello"});
});

test("clear", () => {
    const storage = new Test();
    storage.name = "Hello";
    expect(storage[op.clear]()).toBe(1);
    expect(storage[op.values]).toEqual({});
});

test("cache on setting", () => {
    const data = {name: 'hello'};
    const storage = new Test();
    storage.data = data;
    expect(storage.data).toBe(data);
    const storage2 = new Test();
    expect(storage2.data).toEqual(storage.data);
});

test("cache on getting", () => {
    const data = { name: 'hello' };
    const storage = new Test();
    storage.data = data;
    const storage2 = new Test();
    expect(storage2.data).toEqual(data);
    expect(storage2.data).toBe(storage2.data);
});

test("with id and different id", () => {
    const data = { name: 'hello' };
    const storage = new Test("1");
    storage.data = data;
    const storage2 = new Test("1");
    const storage3 = new Test("3");
    expect(storage2.data).toEqual(data);
    expect(storage3.data).not.toEqual(data);
    storage2[op.clear]();
    storage[op.clear]();
    storage3[op.clear]();
});

test("custom driver", () => {
    const store: any = {}
    class Driver implements IDriver {
        set(key: string, val: string) {
            store[key] = val;
            return this;
        }
        get(key: string) {
            return store[key];
        }
        remove(key: string) {
            delete store[key];
            return this;
        }
        keys() {
            return Object.keys(store);
        }
    }
    const storage = new Test("1", { driver: new Driver() });
    storage.data = 'hello';
    expect(store['1[data]']).toBe('"hello"');
    const storage2 = new Test("1");
    expect(storage2.data).not.toBe('hello');
    expect(storage2.data).toBe(undefined);
    storage[op.clear]();
});
