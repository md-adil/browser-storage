import Storage from "./storage";
export type { IDriver } from "./driver";
export { idKey as id, keys, values } from "./storage";
class BrowserConfig extends Storage {
    [key: string]: any;
}
export default BrowserConfig;
