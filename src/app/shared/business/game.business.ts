import { Injectable } from '@angular/core';
import { Base } from '../model/game/base/base.model';
import { Storage } from '../model/game/base/storage.model';
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
            return JSON.parse(this.cryptService.decrypt(save)) as Game;
        }
        return new Game({
            id: HelperService.guid,
            settlers: [],
            base: new Base({
                constructions: [],
                storage: new Storage([]),
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
