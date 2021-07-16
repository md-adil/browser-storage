import { BaseStorage, IDriver } from "../";

class Driver implements IDriver {
    public store: Record<string, string> = {};
    set(key: string, val: string) {
        this.store[key] = val;
        return this;
    }
    get(key: string) {
        return this.store[key];
    }
    remove(key: string) {
        delete this.store[key];
        return this;
    }
    keys() {
        return Object.keys(this.store);
    }
}

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
    const settingFn = jest.fn();
    class NewDriver extends Driver {
        set(key: string, value: string) {
            super.set(key, value);
            settingFn();
            return this;
        }
    }
    const driver = new NewDriver();
    const storage = new Test('cache-setting', { driver });
    storage.data = data;
    storage.data = data;
    storage.data = data;
    expect(storage.data).toBe(data);
    expect(settingFn.mock.calls.length).toBe(0);
    jest.advanceTimersToNextTimer();
    expect(settingFn.mock.calls.length).toBe(1);
    expect(driver.store[`cache-setting[data]`]).toBe(JSON.stringify(data));
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
    
    const driver = new Driver();
    const storage = new Test("1", { driver });
    storage.data = 'hello';
    jest.advanceTimersToNextTimer();
    expect(driver.store['1[data]']).toBe('"hello"');
});


test("validity", () => {
    const test = new Test('validity', {
        validity: "session"
    });
    test.name = "Hello";
    jest.advanceTimersToNextTimer();
    expect(sessionStorage.getItem(`validity[name]`)).toBe(JSON.stringify('Hello'));
});
