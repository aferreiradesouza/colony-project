import { Injectable } from '@angular/core';
import { GameBusiness } from './game.business';

@Injectable({
    providedIn: 'root',
})
export class StorageBusiness {
    constructor(private gameService: GameBusiness) {
        console.log('oi');
    }
}
