import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HelperService {
    constructor() {}

    public static get guid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line: no-bitwise
            const r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    public static enumToArray<T>(param: T): Array<keyof T> {
        return Object.values(
            param as {
                [s: string]: unknown;
            }
        ).filter((v) => isNaN(Number(v))) as Array<keyof T>;
    }
}
