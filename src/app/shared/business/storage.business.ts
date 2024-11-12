import { Injectable } from '@angular/core';
import { Item } from '../model/game/base/building/storage/item.model';
import { Order, SettlersQueue, Storage } from './../model/game/base/building/storage/storage.model';
import { Items } from '../interface/enums/item.enum';
import { Business } from './business';
import { NotificationService } from '../services/notification.service';
import { Building } from '../model/game/base/building/building.model';
import { Settler } from '../model/game/base/settler/settler.model';

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
     * Gets the queue of settlers.
     * 
     * @returns {SettlersQueue[]} An array of settlers in the queue. If the storage or settlersQueue is undefined, returns an empty array.
     */
    get queue(): SettlersQueue[] {
        return this.storage?.settlersQueue ?? [];
    }

    /**
     * Starts the execution of orders at regular intervals.
     * 
     * This method sets up an interval that repeatedly calls the `executeOrder` method every 50 milliseconds.
     * If the `settlersQueue` is empty, it stops the execution by calling `stopExecuteOrder`.
     * 
     * @remarks
     * This method does nothing if `storage` is not defined.
     */
    startExecuteOrder(): void {
        if(!this.storage) return;   
        this.storage.executeOrderInterval = setInterval(() => {
            this.executeOrder();
            if (!this.storage?.settlersQueue.length) {
                this.stopExecuteOrder();
            }
        }, 50);
    }

    /**
     * Stops the execution of the current order by clearing the interval.
     * If the storage is not defined, the method returns immediately.
     * Otherwise, it clears the interval associated with `executeOrderInterval`
     * and sets it to null.
     */
    stopExecuteOrder(): void {
        if (!this.storage) return;
        clearInterval(this.storage.executeOrderInterval);
        this.storage.executeOrderInterval = null;
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

    /**
     * Retrieves a material item from storage and assigns it to a building's inventory.
     * If the item is not found, it executes building validations and unassigns any settler assigned to the building.
     *
     * @param data - The data required to get the material.
     * @param data.id - The ID of the item to retrieve.
     * @param data.amount - The amount of the item to retrieve.
     * @param data.building - The building to which the item will be assigned.
     * @param data.taskId - (Optional) The task ID associated with the item.
     * 
     * @returns void
     */
    getMaterial(data: {
        id: Items;
        amount: number;
        building: Building;
        taskId?: string | undefined;
    }): void {
        const item = this.getResource(data.id, data.amount);
        if (item && data.taskId) item.taskId = data.taskId;
        if (!item) {
            data.building.executeValidations();
            if (data.building.assignedTo){
                Business.buildingBusiness.unassignSettlerToBuilding(data.building);
            }
            return;
        }
        data.building.addItemInInventory({
            id: data.building.id,
            item,
            taskId: data.taskId,
        });
    }

    /**
     * Adds a settler to the queue with the current date and time as the order.
     *
     * @param settler - The settler to be added to the queue.
     * @returns void
     */
    addSettlerForQueue(settler: Settler, order: Order): void {
        this.storage?.settlersQueue.push({settler, buildingOrder: order.building, dateTimeOrder: Date.now(), order});
    }

    /**
     * Creates an order for a settler and adds it to the queue.
     * If there is no active order execution interval, it starts the execution process.
     *
     * @param settler - The settler for whom the order is created.
     * @param order - The order to be created and added to the queue.
     * @returns void
     */
    createOrder(settler: Settler, order: Order): void {
        this.addSettlerForQueue(settler, order);
        if (!this.storage?.executeOrderInterval) {
            this.startExecuteOrder();
        }
    }

    /**
     * Executes the next order in the settlers queue.
     * 
     * This method retrieves the first order in the queue and attempts to get the requested resource.
     * If the resource is not available, it executes the building validations and unassigns the settler from the building if assigned.
     * If the resource is available, it adds the item to the building's inventory.
     * 
     * The method calls the `onDone` callback with `false` if the resource is not available, and `true` if the resource is successfully added to the inventory.
     * 
     * @returns {void}
     */
    private executeOrder(): void {
        const firstInQueue = this.storage?.settlersQueue.shift();
        if (!firstInQueue) return;
        const item = this.getResource(firstInQueue?.order.item, firstInQueue.order.amount);
        if (!item) {
            firstInQueue.order.building.executeValidations();
            if (firstInQueue.order.building.assignedTo){
                Business.buildingBusiness.unassignSettlerToBuilding(firstInQueue.order.building);
            }
            firstInQueue.order.onDone(false);
        } else {
            firstInQueue.order.building.addItemInInventory({
                id: firstInQueue.order.building.id,
                item,
            });
            firstInQueue.order.onDone(true);
        }
    }
}
