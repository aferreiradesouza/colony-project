import { Component } from '@angular/core';
import { StorageBusiness } from 'src/app/shared/business/storage.business';
import { Itens } from 'src/app/shared/interface/enums/item.enum';
import { Item } from 'src/app/shared/model/game/base/building/storage/item.model';
import { Storage } from 'src/app/shared/model/game/base/building/storage/storage.model';
import { DebugService } from 'src/app/shared/services/debug.service';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.page.html',
    styleUrls: ['./storage.page.scss'],
})
export class StoragePage {
    constructor(
        private storageBusiness: StorageBusiness,
        private debugService: DebugService
    ) {}

    createStorage(): void {
        this.debugService.createStorage();
    }

    adicionarCarne(): void {
        this.debugService.addItem(Itens.Meat, 5);
    }

    adicionarPedra(): void {
        this.debugService.addItem(Itens.Stone, 100);
    }

    adicionarMadeira(): void {
        this.debugService.addItem(Itens.Wood, 100);
    }

    get inventory(): Item[] {
        return this.storageBusiness.inventory;
    }

    get storage(): Storage | null {
        return this.storageBusiness.storage ?? null;
    }

    get hasStorage(): boolean {
        return this.storageBusiness.hasStorage;
    }

    log(item: Item): void {
        console.log(item);
    }
}
