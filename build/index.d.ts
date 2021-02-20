declare type Key = string | number;
declare class BrowserConfig<T = any> {
    readonly id: string;
    private iterable;
    [key: string]: any;
    readonly _keyMaps: Set<Key>;
    constructor(id?: string, iterable?: boolean);
    private updateKeys;
    set(key: Key, value: T): this;
    get(key: Key, def?: T): any;
    delete(key: Key): this;
    values(): any;
    keys(): Key[];
    [Symbol.iterator](): Generator<any[], void, unknown>;
}
export default BrowserConfig;
