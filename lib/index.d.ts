import BaseStorage, { IOption } from "./storage";
export type { IDriver } from "./driver";
export { op } from "./storage";
export { BaseStorage };
export default class BrowserConfig extends BaseStorage {
    static create<T extends any>(id?: string, opt?: IOption): T & BrowserConfig;
    [key: string]: any;
}
