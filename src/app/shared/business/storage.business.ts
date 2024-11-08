import { Injectable } from '@angular/core';
import { Item } from '../model/game/base/building/storage/item.model';
import { Storage } from './../model/game/base/building/storage/storage.model';
import { Items } from '../interface/enums/item.enum';
import { Business } from './business';
import { NotificationService } from '../services/notification.service';

@Injectable({
    providedIn: 'root',
})
/**
 * StorageBusiness handles the operations related to the storage system in the game.
 */
export class StorageBusiness {
    constructor(private notificationService: NotificationService) {}

    /**
     * Gets the current storage instance.
     * @returns {Storage | null} The current storage or null if not available.
     */
    get storage(): Storage | null {
        return Business.gameBusiness.game.base.storage ?? null;
    }

    /**
     * Builds and sets the storage instance.
     * @param {Storage} storage - The storage instance to be set.
     */
    build(storage: Storage): void {
        Business.gameBusiness.game.base.storage = storage;
    }

    /**
     * Gets the inventory of the current storage.
     * @returns {Item[]} The inventory items.
     */
    get inventory(): Item[] {
        return this.storage!.inventory;
    }

    /**
     * Checks if the storage is available.
     * @returns {boolean} True if storage is available, otherwise false.
     */
    get hasStorage(): boolean {
        return !!this.storage?.isStorageAvailable;
    }

    /**
     * Gets an item by its ID.
     * @param {string} id - The ID of the item.
     * @returns {Item | null} The item if found, otherwise null.
     */
    getItemById(id: string): Item | null {
        return this.storage?.inventory.find((e) => e.id === id) ?? null;
    }

    /**
     * Gets an item by its type.
     * @param {Items} type - The type of the item.
     * @returns {Item | null} The item if found, otherwise null.
     */
    getItemByType(type: Items): Item | null {
        return this.storage?.getItemByType(type) ?? null;
    }

    /**
     * Adds a new item to the storage.
     * @param {Item} newItem - The item to be added.
     */
    addItem(newItem: Item): void {
        this.storage?.addItem(newItem);
    }

    /**
     * Removes a material from the storage.
     * @param {Items} type - The type of the material.
     */
    removeMaterial(type: Items): void {
        this.storage?.removeResource(type, () => {
            this.notificationService.itemRemovedSuccess({title: 'Item'});
        });
    }

    /**
     * Gets a specified amount of a resource.
     * @param {Items} type - The type of the resource.
     * @param {number} amount - The amount to be retrieved.
     * @returns {Item | null} The item if found, otherwise null.
     */
    getResource(type: Items, amount: number): Item | null {
        return this.storage?.getResource(type, amount) ?? null;
    }
}
