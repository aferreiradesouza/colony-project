import { Injectable } from '@angular/core';
import { Settler } from '../model/settler/settler.model';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class SettlersService {
    constructor(private gameService: GameService) {}

    public add(settler: Settler, game = this.gameService.game): void {
        game.addSettler(settler);
    }

    public replace(settler: Settler[], game = this.gameService.game): void {
        game.replaceSettler(settler);
    }

    get settlers(): Settler[] {
        return this.gameService.game.settlers;
    }
}
