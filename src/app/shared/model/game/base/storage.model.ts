interface Inventory {
    id: ItemStorage;
}

export class Storage {
    public list: Inventory[];

    constructor(list: Inventory[]) {
        this.list = list;
    }
}

export enum ItemStorage {
    Meat,
}
