import { IDriver } from "./driver";
declare type Key = string | number;
declare const ID: unique symbol;
declare const KEYS: unique symbol;
declare const VALUES: unique symbol;
declare const OPTION: unique symbol;
declare const GET: unique symbol;
declare const SET: unique symbol;
declare const REMOVE: unique symbol;
declare const DATA: unique symbol;
declare const CLEAR: unique symbol;
declare const DIRTY: unique symbol;
declare const PENDING: unique symbol;
declare const UPDATE: unique symbol;
declare const REPLACE: unique symbol;
export declare const op: {
    readonly keys: typeof KEYS;
    readonly values: typeof VALUES;
    readonly id: typeof ID;
    readonly clear: typeof CLEAR;
    readonly update: typeof UPDATE;
    readonly replace: typeof REPLACE;
};
export interface IOption {
    driver: IDriver;
    validity: "session" | "lifetime";
}
export default abstract class BaseStorage {
    static keys(instance: BaseStorage): string[];
    static clear(instance: BaseStorage): number;
    static values(instance: BaseStorage): number;
    static update(instance: BaseStorage, data: object): void;
    static id(instance: BaseStorage): string;
    readonly [ID]: string;
    private readonly [OPTION];
    private readonly [DATA];
    private readonly [DIRTY];
    private [PENDING];
    constructor(id?: string, option?: Partial<IOption>);
    set [UPDATE](value: Record<Key, any>);
    set [REPLACE](value: Record<Key, any>);
    [SET](key: Key, value: any): this;
    [GET](key: Key): any;
    [REMOVE](key: Key): this;
    get [CLEAR](): number;
    get [VALUES](): any;
    get [KEYS](): string[];
    [Symbol.iterator](): Generator<any[], void, unknown>;
}
export {};
