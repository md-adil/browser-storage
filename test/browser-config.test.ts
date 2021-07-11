import BrowserConfig, { op } from "../lib"

test("create with typed", () => {
    interface IPerson {
        name?: string;
        email?: string;
    }
    const store = BrowserConfig.create<IPerson>();
    store.name = "Adil";
    expect(store.name).toBe("Adil");
    expect(store[op.keys]).toEqual(["name"]);
    expect(store[op.clear]()).toBe(1);
})