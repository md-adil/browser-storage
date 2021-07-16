import { DefaultDriver } from "../lib/driver";

const driver = new DefaultDriver();
test("setting value", () => {
    expect(driver.set("name", "adil")).toBe(driver);
})

test("getting value", () => {
    expect(driver.get("name")).toBe("adil");
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
