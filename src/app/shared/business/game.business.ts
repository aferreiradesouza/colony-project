import { Injectable } from '@angular/core';
import { Base } from '../model/game/base/base.model';
import { Game } from '../model/game/game.model';
import { CryptHandlerService } from '../services/crypt-handler.service';
import { HelperService } from '../services/helpers.service';
import { StorageHandler } from '../services/storage-handler.service';
import { TaskBusiness } from './task.business';
import { StorageBusiness } from './storage.business';
import { SettlersBusiness } from './settlers.business';
import { BuildingBusiness } from './building.business';
import { Business } from './business';
import { BaseBusiness } from './base.business';

@Injectable({ providedIn: 'root' })
export class GameBusiness {
    private _game: Game;

    constructor(
        private cryptService: CryptHandlerService,
        public baseBusiness: BaseBusiness,
        public buildingBusiness: BuildingBusiness,
        public settlersBusiness: SettlersBusiness,
        public storageBusiness: StorageBusiness,
        public taskBusiness: TaskBusiness
    ) {
        this.inject();
        this._game = this.loadGame;
    }

    inject(): void {
        Business.gameBusiness = this;
        Business.baseBusiness = this.baseBusiness;
        Business.buildingBusiness = this.buildingBusiness;
        Business.settlersBusiness = this.settlersBusiness;
        Business.taskBusiness = this.taskBusiness;
        Business.storageBusiness = this.storageBusiness;
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

    public deleteSave(): void {
        StorageHandler.remove('save');
    }

    private _setGame(game: Game): void {
        this._game = game;
    }

    public get game(): Game {
        return this._game;
    }
}
