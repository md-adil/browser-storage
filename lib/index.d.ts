import BaseStorage, { IOption } from "./storage";
export type { IDriver } from "./driver";
export { BaseStorage };
export default class BrowserConfig extends BaseStorage {
    static create<T extends any>(id?: string, opt?: Partial<IOption>): T & BrowserConfig;
    [key: string]: any;
}
