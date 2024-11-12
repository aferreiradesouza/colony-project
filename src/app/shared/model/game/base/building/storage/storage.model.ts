import { Biomes } from 'src/app/shared/interface/enums/biomes.enum';
import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Items } from 'src/app/shared/interface/enums/item.enum';
import { Settler } from '../../settler/settler.model';
import { Building, BuildingData } from '../building.model';
import { Item } from './item.model';
import { EfficiencyBusiness } from 'src/app/shared/business/efficiency.business';
import { Skill } from 'src/app/shared/interface/enums/skill.enum';

interface StorageData {
    inventory: Item[];
    building?: BuildingData;
}

export interface SettlersQueue {
    settler: Settler;
    dateTimeOrder: number;
    buildingOrder: Building;
    order: Order;
}

export interface Order {
    item: Items,
    amount: number,
    building: Building,
    onDone: (success: boolean) => void,
}

export class Storage extends Building {
    public level = 1;
    public maxStorage = 100;
    public settlersQueue: SettlersQueue[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public executeOrderInterval: any;

    constructor(data: StorageData) {
        super(Storage.initializeBuildingData(data));
        this.inventory = data.inventory.map((e) => new Item(e));
        this.settlersQueue = [];
    }

    /**
     * Initializes the building data for the storage.
     *
     * @param data - The storage data.
     * @returns The initialized building data.
     */
    private static initializeBuildingData(data: StorageData): BuildingData {
        return data.building
            ? {
                  ...data.building,
                  type: Buildings.Storage,
              }
            : {
                  type: Buildings.Storage,
                  status: 'not-started',
                  biome: Biomes.Lake,
              };
    }

    /**
     * Checks if the storage is available.
     *
     * @returns True if the storage is available, otherwise false.
     */
    get isStorageAvailable(): boolean {
        return this.status === 'done';
    }

    /**
     * Gets the remaining storage space available.
     *
     * @returns The number of available storage slots.
     */
    get storageHasSpacing(): number {
        return this.maxStorage - this.inventory.length;
    }

    /**
     * Gets an item by its type.
     *
     * @param type - The type of the item.
     * @returns The item if found, otherwise null.
     */
    getItemByType(type: Items): Item | null {
        return this.inventory.find((e) => e.type === type) ?? null;
    }

    /**
     * Removes a resource from the inventory.
     *
     * @param itemType - The type of the item to remove.
     * @param onDone - Optional callback function to execute after removal.
     */
    removeResource(itemType: Items, onDone?: () => void): void {
        const index = this.inventory.findIndex((e) => e.type === itemType);
        if (index <= -1) return;
        this.inventory.splice(index, 1);
        if (onDone) onDone();
    }

    /**
     * Uses a specified amount of a resource.
     *
     * @param itemType - The type of the item to use.
     * @param amount - The amount of the item to use.
     */
    private useResource(itemType: Items, amount: number): void {
        const item = this.getItemByType(itemType);
        if (!this.isItemAmountSufficient(item, amount) || !item) return;
        item.amount -= amount;
        if (item.amount <= 0) this.removeResource(itemType);
    }

    /**
     * Checks if the item amount is sufficient.
     *
     * @param item - The item to check.
     * @param amount - The required amount.
     * @returns True if the item amount is sufficient, otherwise false.
     */
    private isItemAmountSufficient(item: Item | null, amount: number): boolean {
        return item !== null && item.amount >= amount;
    }

    /**
     * Retrieves a specified amount of a resource item.
     *
     * @param type - The type of the resource item to retrieve.
     * @param amount - The amount of the resource item to retrieve.
     * @returns The retrieved resource item with the specified amount, or null if the item is not available in sufficient quantity.
     */
    getResource(type: Items, amount: number): Item | null {
        const item = this.findItemWithSufficientAmount(type, amount);
        if (!item) return null;

        this.useResource(type, amount);
        return this.createItemWithAmount(item, amount);
    }

    /**
     * Finds an item with sufficient amount.
     *
     * @param type - The type of the item.
     * @param amount - The required amount.
     * @returns The item if found, otherwise null.
     */
    private findItemWithSufficientAmount(type: Items, amount: number): Item | null {
        return this.inventory.find((e) => e.type === type && e.amount >= amount) ?? null;
    }

    /**
     * Creates a new item with the specified amount.
     *
     * @param item - The original item.
     * @param amount - The amount for the new item.
     * @returns The new item with the specified amount.
     */
    private createItemWithAmount(item: Item, amount: number): Item {
        return { ...item, amount } as Item;
    }

    /**
     * Adds a new item to the storage. If an item of the same type already exists,
     * it increments the amount of that item. Otherwise, it adds the new item to the inventory.
     *
     * @param newItem - The item to be added to the storage.
     */
    addItem(newItem: Item): void {
        const itemInStorage = this.getItemByType(newItem.type);
        if (itemInStorage) {
            itemInStorage.amount += newItem.amount;
        }
        else this.inventory.push(newItem);
    }

    /**
     * Retrieves an item from the inventory by its ID.
     *
     * @param id - The unique identifier of the item to retrieve.
     * @returns The item with the specified ID, or `null` if no such item exists.
     */
    getItemById(id: string): Item | null {
        return this.inventory.find((e) => e.id === id) ?? null;
    }
}
