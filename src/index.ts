import Storage, { IOption } from "./storage";
export type { IDriver } from "./driver";
export { op } from "./storage";

export default class BrowserConfig extends Storage {
    static create<T extends any>(id?: string, opt?: IOption) {
        return <T & BrowserConfig>new BrowserConfig(id, opt);
    }
    [key: string]: any;
}
