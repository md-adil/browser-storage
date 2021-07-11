export interface IDriver {
    set(key: string, value: string): this;
    get(key: string): string | null;
    remove(key: string): this;
    keys(): string[];
}
export declare class DefaultDriver implements IDriver {
    private readonly engine;
    constructor(temp?: boolean);
    get(key: string): string | null;
    set(key: string, value: string): this;
    remove(key: string): this;
    keys(): string[];
}
