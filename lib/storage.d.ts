import { IDriver } from "./driver";
declare type Key = string | number;
declare const ID: unique symbol;
declare const KEYS: unique symbol;
declare const VALUES: unique symbol;
declare const OPTION: unique symbol;
declare const GET: unique symbol;
declare const SET: unique symbol;
declare const REMOVE: unique symbol;
declare const KEY_MAPS: unique symbol;
declare const DATA: unique symbol;
declare const CLEAR: unique symbol;
export declare const op: {
    readonly keys: typeof KEYS;
    readonly values: typeof VALUES;
    readonly id: typeof ID;
    readonly clear: typeof CLEAR;
};
export interface IOption {
    driver: IDriver;
    validity: "session" | "lifetime";
}
export default abstract class BaseStorage {
    readonly [op.id]: string;
    [KEY_MAPS]?: Set<Key>;
    private readonly [OPTION];
    private readonly [DATA];
    constructor(id?: string, option?: Partial<IOption>);
    [SET](key: Key, value: any): this;
    [GET](key: Key): any;
    [REMOVE](key: Key): this;
    [CLEAR](): number;
    get [VALUES](): any;
    get [KEYS](): Key[];
    [Symbol.iterator](): Generator<any[], void, unknown>;
}
export {};
