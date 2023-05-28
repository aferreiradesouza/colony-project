import { Item } from '../building/storage/item.model';

export class Inventory {
    public items: Item[];

    constructor(data: Item[] = []) {
        this.items = data;
    }
}