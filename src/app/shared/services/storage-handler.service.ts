import { KeyStorage } from '../interface/type';

export class StorageHandler {
    constructor() {}

    public static has(key: KeyStorage): boolean {
        return key in localStorage;
    }

    public static get(key: KeyStorage): string | null {
        return localStorage.getItem(key);
    }

    public static getJson<T>(key: KeyStorage): T | null {
        return JSON.parse(this.get(key) || '') || null;
    }

    public static set(key: KeyStorage, value: string): void {
        localStorage.setItem(key, value);
    }

    public static setJson<T>(key: KeyStorage, value: T): void {
        this.set(key, JSON.stringify(value));
    }

    public static remove(key: KeyStorage): void {
        localStorage.removeItem(key);
    }
}
