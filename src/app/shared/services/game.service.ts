import { Injectable } from '@angular/core';
import { Base } from '../model/base/base.model';
import { Construction, Constructions } from '../model/base/construction.model';
import { Game } from '../model/game/game.model';
import { Settler } from '../model/settler/settler.model';
import { Skill, Skills } from '../model/settler/skill.model';
import { Job, Work } from '../model/settler/work.model';
import { CryptHandlerService } from './crypt-handler.service';
import { HelperService } from './helpers.service';
import { StorageHandler } from './storage-handler.service';

@Injectable({ providedIn: 'root' })
export class GameService {
    private _game: Game;

    constructor(private cryptService: CryptHandlerService) {
        this._game = new Game({
            id: HelperService.guid,
            settlers: [],
            base: new Base({
                constructions: [
                    new Construction({
                        id: Constructions.Storage,
                        status: 'not-started',
                    }),
                    new Construction({
                        id: Constructions.House,
                        status: 'not-started',
                    }),
                    new Construction({
                        id: Constructions.Kitchen,
                        status: 'not-started',
                    }),
                    new Construction({
                        id: Constructions.Farm,
                        status: 'not-started',
                    }),
                    new Construction({
                        id: Constructions.Factory,
                        status: 'not-started',
                    }),
                ],
            }),
        });
    }

    public save(): void {
        const game = JSON.stringify(this.game);
        const crypt = this.cryptService.encrypt(game);
        StorageHandler.set('save', crypt);
    }

    public load(): void {
        if (!StorageHandler.has('save')) return;
        const save = StorageHandler.get('save')!;
        const game = JSON.parse(this.cryptService.decrypt(save)) as Game;
        this._setGame(new Game(game));
    }

    private _setGame(game: Game): void {
        this._game = game;
    }

    public get game(): Game {
        return this._game;
    }
}
