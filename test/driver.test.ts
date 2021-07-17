import { DefaultDriver } from "../lib/driver";

const driver = new DefaultDriver();
test("setting value", () => {
    const settingFn = jest.spyOn(localStorage.__proto__, 'setItem');
    expect(driver.set("name", "adil")).toBe(driver);
    expect(settingFn).toHaveBeenCalledWith('name', 'adil');
})

test("setting value temp", () => {
    const driver = new DefaultDriver(true);
    const settingFn = jest.spyOn(sessionStorage.__proto__, 'setItem');
    expect(driver.set("name", "adil")).toBe(driver);
    expect(settingFn).toHaveBeenCalledWith('name', 'adil');
    settingFn.mockRestore();
});

test("getting value", () => {
    const gettingFn = jest.spyOn(localStorage.__proto__, 'getItem');
    gettingFn.mockReturnValue('world');
    expect(driver.get('hello')).toBe('world');
    expect(gettingFn).toHaveBeenCalledWith('hello');
    gettingFn.mockRestore();
});

test("removing value", () => {
    expect(driver.remove("name")).toBe(driver);
    expect(driver.get("name")).toBe(null);
});

test("get keys", () => {
    driver.set("name", "Adil");
    driver.set("email", "hello world");
    expect([...driver.keys()]).toEqual(["name", "email"]);
});
