import Storage from "./storage";
export type { IDriver } from "./driver";
export { op } from "./storage";
declare class BrowserConfig extends Storage {
    [key: string]: any;
}
export default BrowserConfig;
