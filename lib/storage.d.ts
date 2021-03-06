import { IDriver } from "./driver";
declare type Key = string | number;
declare const ID: unique symbol;
declare const OPTION: unique symbol;
declare const GET: unique symbol;
declare const SET: unique symbol;
declare const REMOVE: unique symbol;
declare const DATA: unique symbol;
declare const DIRTY: unique symbol;
declare const PENDING: unique symbol;
export interface IOption {
    driver: IDriver;
    validity: "session" | "permanent";
}
export default abstract class BaseStorage {
    static keys(instance: BaseStorage): Generator<string, void, unknown>;
    static clear(instance: BaseStorage): number;
    static values(instance: BaseStorage): any;
    static update(instance: BaseStorage, data: Record<string, any>): BaseStorage;
    static set(instance: BaseStorage, data: Record<string, any>): void;
    static id(instance: BaseStorage): string;
    readonly [ID]: string;
    private readonly [OPTION];
    private readonly [DATA];
    private readonly [DIRTY];
    private [PENDING];
    constructor(id?: string, option?: Partial<IOption>);
    [SET](key: Key, value: any): this;
    [GET](key: Key): any;
    [REMOVE](key: Key): this;
    [Symbol.iterator](): Generator<any[], void, unknown>;
}
export {};
