import { BaseStorage, IDriver, op } from "../";
import { sleep } from "./util";

class Test extends BaseStorage {
    [key: string]: any;
}

beforeEach( async () => {
    new Test()[op.clear]
    await sleep(1);
})

test("id", () => {
    const storage = new Test();
    expect(storage[op.id]).toBe("Test");
    const storage2 = new Test('test2');
    expect(storage2[op.id]).toBe("test2");
});

test("setting/getting/removing", () => {
    const storage = new Test();
    storage.name = "Hello";
    expect(storage.name).toBe("Hello");
    delete storage.name;
    expect(storage.name).toBe(undefined);
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
    expect(storage[op.clear]).toBe(1);
    expect(storage[op.values]).toEqual({});
});

test("cache on setting", async () => {
    const data = {name: 'hello'};
    const storage = new Test();
    storage.data = data;
    expect(storage.data).toBe(data);
    await sleep(1);
    const storage2 = new Test();
    expect(storage2.data).toEqual(storage.data);
});

test("cache on getting", async () => {
    const data = { name: 'hello' };
    const storage = new Test();
    storage.data = data;
    const storage2 = new Test();
    expect(storage2.data).toBe(storage2.data);
    await sleep(1)
    expect(storage2.data).toEqual(data);
});

test("with id and different id", async () => {
    const data = { name: 'hello' };
    const storage = new Test("1");
    storage.data = data;
    const storage2 = new Test("1");
    const storage3 = new Test("3");
    await sleep(1);
    expect(storage2.data).toEqual(data);
    expect(storage3.data).not.toEqual(data);
    storage2[op.clear];
    storage[op.clear];
    storage3[op.clear];
});

test("custom driver", async () => {
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
    await sleep(1);
    expect(store['1[data]']).toBe('"hello"');
});
