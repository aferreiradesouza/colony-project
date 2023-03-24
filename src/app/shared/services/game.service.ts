import { Injectable } from '@angular/core';
import { Base } from '../model/base/base.model';
import { Game } from '../model/game/game.model';
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
                constructions: [],
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
