import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LogService {
    static log: string[] = [];

    constructor() {}

    static add(text: string): void {
        LogService.log.push(text);
        if (this.log.length > 1000) {
            LogService.log = LogService.log.slice(1);
        }
    }
}
