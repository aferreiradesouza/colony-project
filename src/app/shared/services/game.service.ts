import { Injectable } from '@angular/core';
import { Settler } from '../model/settler/settler.model';
import { CryptHandlerService } from './crypt-handler.service';
import { SettlersService } from './settlers.service';
import { StorageHandler } from './storage-handler.service';

@Injectable({ providedIn: 'root' })
export class GameService {
    constructor(
        private settlerService: SettlersService,
        private cryptService: CryptHandlerService
    ) {}

    save(): void {
        const settlers = JSON.stringify(this.settlerService.settlers);
        const crypt = this.cryptService.encrypt(settlers);
        StorageHandler.set('save', crypt);
    }

    load(): void {
        if (!StorageHandler.has('save')) return;
        const save = StorageHandler.get('save')!;
        const settlers = JSON.parse(
            this.cryptService.decrypt(save)
        ) as Settler[];
        console.log(settlers);
        this.settlerService.replace(settlers.map((e) => new Settler(e)));
    }
}
