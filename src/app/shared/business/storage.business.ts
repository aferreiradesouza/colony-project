import { Injectable } from '@angular/core';
import { Item } from '../model/game/base/building/storage/item.model';
import { Storage } from './../model/game/base/building/storage/storage.model';
import { Items } from '../interface/enums/item.enum';
import { Business } from './business';

@Injectable({
    providedIn: 'root',
})
export class StorageBusiness {
    constructor() {}

    get storage(): Storage | null {
        return Business.gameBusiness.game.base.storage ?? null;
    }

    buildStorage(storage: Storage): void {
        Business.gameBusiness.game.base.storage = storage;
    }

    get inventory(): Item[] {
        return Business.gameBusiness.game.base.storage!.inventory;
    }

    get hasStorage(): boolean {
        return (
            !!Business.gameBusiness.game.base.storage &&
            Business.gameBusiness.game.base.storage.status === 'done'
        );
    }

    getItemById(id: string): Item | null {
        return this.storage?.inventory.find((e) => e.id === id) ?? null;
    }

    getItemByType(type: Items): Item | null {
        return this.storage?.inventory.find((e) => e.type === type) ?? null;
    }

    addItem(newItem: Item): void {
        const ItemOfStorage = this.getItemByType(newItem.type);
        if (ItemOfStorage) ItemOfStorage.amount += newItem.amount;
        else this.storage!.inventory.push(newItem);
    }

    useResource(type: Items, amount: number): void {
        const item = this.getItemByType(type);
        if (!item) return;
        item.amount -= amount;
        if (item.amount <= 0) this.removeMaterial(type);
    }

    removeMaterial(type: Items): void {
        const index = this.inventory.findIndex((e) => e.type === type);
        if (index <= -1) return;
        this.inventory.splice(index, 1);
    }

    getResource(type: Items, amount: number): Item | null {
        const item = this.inventory.find(
            (e) => e.type === type && e.amount >= amount
        );
        if (item) {
            this.useResource(type, amount);
            return { ...item, amount } as Item;
        } else {
            return null;
        }
    }
}
