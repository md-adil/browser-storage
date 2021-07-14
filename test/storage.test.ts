import { BaseStorage, IDriver } from "../";

class Test extends BaseStorage {
    [key: string]: any;
}

beforeEach( async () => {
    jest.useFakeTimers();
    Test.clear(new Test());
    jest.advanceTimersToNextTimer();
});

afterEach(() => {
    jest.useRealTimers();
})

test("id", () => {
    const storage = new Test();
    expect(Test.id(storage)).toBe("1394d12c");
    const storage2 = new Test('test2');
    expect(Test.id(storage2)).toBe("test2");
});

test("setting/getting/removing", () => {
    const storage = new Test();
    storage.name = "Hello";
    expect(storage.name).toBe("Hello");
    delete storage.name;
    expect(storage.name).toBe(undefined);
});

test("keys", async () => {
    const storage = new Test('keys');
    storage.name = "Hello";
    expect([...Test.keys(storage)]).toEqual(["name"]);
});

test("values", () => {
    const storage = new Test('values');
    storage.name = "Hello";
    expect(Test.values(storage)).toEqual({name: "Hello"});
});

test("clear", () => {
    const storage = new Test();
    storage.name = "Hello";
    expect(Test.clear(storage)).toBe(1);
    expect(Test.values(storage)).toEqual({});
});

test("cache on setting", async () => {
    const data = { name: 'hello' };
    const storage = new Test();
    storage.data = data;
    expect(storage.data).toBe(data);
    const storage2 = new Test();
    expect(storage2.data).not.toEqual(storage.data);
    jest.advanceTimersToNextTimer();
    expect(storage2.data).toEqual(storage.data);
});

test("cache on getting", async () => {
    const data = { name: 'hello' };
    const storage = new Test();
    storage.data = data;
    const storage2 = new Test();
    expect(storage2.data).toBe(storage2.data);
    expect(storage2.data).not.toEqual(data);
    jest.advanceTimersToNextTimer();
    expect(storage2.data).toEqual(data);
});

test("cache on removing", async () => {
    const storage = new Test('cache remove');
    storage.data = 'hello';
    jest.advanceTimersToNextTimer();
    delete storage.data;
    expect(localStorage.getItem('cache remove[data]')).toBeTruthy();
    jest.advanceTimersToNextTimer();
    expect(localStorage.getItem('cache remove[data]')).toBeNull();
});

test("with id and different id", async () => {
    const data = { name: 'hello' };
    const storage = new Test("1");
    storage.data = data;
    const storage2 = new Test("1");
    const storage3 = new Test("3");
    jest.advanceTimersToNextTimer();
    expect(storage2.data).toEqual(data);
    expect(storage3.data).not.toEqual(data);
    Test.clear(storage);
    Test.clear(storage2);
    Test.clear(storage3);
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
    jest.advanceTimersToNextTimer();
    expect(store['1[data]']).toBe('"hello"');
});


test("validity", () => {
    const test = new Test('validity', {
        validity: "session"
    });
    test.name = "Hello";
    jest.advanceTimersToNextTimer();
    expect(sessionStorage.getItem(`validity[name]`)).toBe(JSON.stringify('Hello'));
});
