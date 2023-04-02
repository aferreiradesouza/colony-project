import { Injectable } from '@angular/core';
import { Base } from '../model/game/base/base.model';
import { Game } from '../model/game/game.model';
import { CryptHandlerService } from '../services/crypt-handler.service';
import { HelperService } from '../services/helpers.service';
import { StorageHandler } from '../services/storage-handler.service';

@Injectable({ providedIn: 'root' })
export class GameBusiness {
    private _game: Game;

    constructor(private cryptService: CryptHandlerService) {
        this._game = this.loadGame;
    }

    get loadGame(): Game {
        if (StorageHandler.has('save')) {
            const save = StorageHandler.get('save')!;
            const game = JSON.parse(this.cryptService.decrypt(save)) as Game;
            return new Game(game);
        }
        return this.newGame;
    }

    private get newGame(): Game {
        return new Game({
            id: HelperService.guid,
            base: new Base({
                buildings: [],
                storage: null,
                settlers: [],
            }),
        });
    }

    public save(): void {
        const game = JSON.stringify(this.game);
        const crypt = this.cryptService.encrypt(game);
        StorageHandler.set('save', crypt);
    }

    private _setGame(game: Game): void {
        this._game = game;
    }

    public get game(): Game {
        return this._game;
    }
}
