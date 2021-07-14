import BrowserConfig from "../lib"

test("set/get/delete/by/id", async () => {
    const store = new BrowserConfig();
    store.name = "Adil";
    expect(store.name).toBe("Adil");
    expect([...BrowserConfig.keys(store)]).toEqual(["name"]);
    expect(BrowserConfig.id(store)).toBe('4f94fbc1');
    expect(BrowserConfig.clear(store)).toBe(1);
})

test("create with typed", async () => {
    jest.useFakeTimers();
    interface IPerson {
        name?: string;
        email?: string;
    }
    const store = BrowserConfig.create<IPerson>('create with typed');
    store.name = "Adil";
    expect(store.name).toBe("Adil");
    jest.advanceTimersToNextTimer();
    expect([...BrowserConfig.keys(store)]).toEqual(["name"]);
    expect(BrowserConfig.clear(store)).toBe(1);
    jest.useRealTimers();
});
