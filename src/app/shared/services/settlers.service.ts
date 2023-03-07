import { Injectable } from '@angular/core';
import { Settler } from '../model/settler/settler.model';

@Injectable({ providedIn: 'root' })
export class SettlersService {
    private _settlers: Settler[] = [];

    constructor() {}

    public add(settler: Settler): void {
        this._settlers.push(settler);
    }

    public replace(settler: Settler[]): void {
        this._settlers = settler;
    }

    get settlers(): Settler[] {
        return this._settlers;
    }
}
