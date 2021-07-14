import BrowserConfig from "../lib"
import { sleep } from "./util";

test("set/get/delete/by/id", async () => {
    const store = new BrowserConfig();
    store.name = "Adil";
    expect(store.name).toBe("Adil");
    expect([...BrowserConfig.keys(store)]).toEqual(["name"]);
    expect(BrowserConfig.id(store)).toBe('4f94fbc1');
    expect(BrowserConfig.clear(store)).toBe(1);
})

test("create with typed", async () => {
    interface IPerson {
        name?: string;
        email?: string;
    }
    const store = BrowserConfig.create<IPerson>('create with typed');
    store.name = "Adil";
    expect(store.name).toBe("Adil");
    await sleep(1);
    expect([...BrowserConfig.keys(store)]).toEqual(["name"]);
    expect(BrowserConfig.clear(store)).toBe(1);
});