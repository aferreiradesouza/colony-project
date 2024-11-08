import { Items } from 'src/app/shared/interface/enums/item.enum';
import { Item } from '../building/storage/item.model';
export class Inventory {
    public items: Item[];

    constructor(data: Item[] = []) {
        this.items = data;
    }

    /**
     * Retrieves an item by its ID.
     * @param id The ID of the item to retrieve.
     * @returns The item with the specified ID, or null if not found.
     */
    getItemById(id: string): Item | null {
        return this.items.find(e => e.id === id) ?? null;
    }

    /**
     * Retrieves an item by its type.
     * @param type The type of the item to retrieve.
     * @returns The item with the specified type, or null if not found.
     */
    getItemByType(type: Items): Item | null {
        return this.items.find(e => e.type === type) ?? null;
    }

    /**
     * Adds an item to the inventory. If the item already exists, its amount is increased.
     * @param item The item to add.
     */
    addItem(item: Item): void {
        const itemInInventory = this.getItemByType(item.type);
        if (itemInInventory) {
            itemInInventory.amount += item.amount;
        }
        else this.items.push(item);
    }

    /**
     * Removes a specified amount of an item from the inventory.
     * @param type The type of the item to remove.
     * @param amount The amount of the item to remove.
     */
    removeItem(type: Items, amount: number): void {
        const item = this.getItemByType(type);
        if (!this.isItemAmountSufficient(item, amount) || !item) return;
        item.amount -= amount;
        if (item.amount <= 0) {
            const index = this.items.findIndex((e) => e.type === type);
            if (index <= -1) return;
            this.items.splice(index, 1);
        }
        this.items = this.items.filter(e => e.type !== type);
    }

    /**
     * Checks if the inventory has a sufficient amount of an item.
     * @param item The item to check.
     * @param amount The required amount.
     * @returns True if the inventory has enough of the item, false otherwise.
     */
    private isItemAmountSufficient(item: Item | null, amount: number): boolean {
        return item !== null && item.amount >= amount;
    }
}