import { Injectable } from '@angular/core';
import { Settler } from '../model/settler/settler.model';
import { HelperService } from './helpers.service';

@Injectable({ providedIn: 'root' })
export class SettlersService {
    public settlers: Settler[] = [];
    id = HelperService.createGuid();

    constructor() {}

    public addSettler(settler: Settler): void {
        this.settlers.push(settler);
    }
}
