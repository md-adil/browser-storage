import BrowserConfig, { op } from "../lib"
import { sleep } from "./util";

test("set/get/delete/by/id", async () => {
    const store = new BrowserConfig();
    store.name = "Adil";
    await sleep(1);
    expect(store.name).toBe("Adil");
    expect(store[op.keys]).toEqual(["name"]);
    expect(store[op.id]).toBe('BrowserConfig');
    expect(store[op.clear]).toBe(1);
})

test("create with typed", async () => {
    interface IPerson {
        name?: string;
        email?: string;
    }
    const store = BrowserConfig.create<IPerson>();
    store.name = "Adil";
    expect(store.name).toBe("Adil");
    await sleep(1);
    expect(store[op.keys]).toEqual(["name"]);
    BrowserConfig.values(store);
    expect(store[op.clear]).toBe(1);
})