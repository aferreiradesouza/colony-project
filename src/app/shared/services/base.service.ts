import { Injectable } from '@angular/core';
import { Construction } from '../model/base/construction.model';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class BaseService {
    constructor(private gameService: GameService) {}

    get contructions(): Construction[] {
        return this.gameService.game.base.constructions;
    }

    addContruction(construction: Construction): void {
        this.gameService.game.base.createConstruction(construction);
    }
}
