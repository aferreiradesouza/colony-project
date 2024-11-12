import { Items } from '../interface/enums/item.enum';

export interface IItemDatabase {
    id: Items;
    name: string;
    weight: number;
}

export class ItemDatabase {
    constructor() {}

    static get items(): { [key in Items]: IItemDatabase } {
        return {
            [Items?.Meat]: {
                id: Items?.Meat,
                name: 'Carne',
                weight: 0.2,
            },
            [Items?.RefeicaoSimples]: {
                id: Items?.RefeicaoSimples,
                name: 'Refeição Simples',
                weight: 0.8,
            },
            [Items?.RefeicaoCompleta]: {
                id: Items?.RefeicaoCompleta,
                name: 'Refeição Completa',
                weight: 1,
            },
            [Items?.Wood]: {
                id: Items?.Wood,
                name: 'Madeira',
                weight: 1.5,
            },
            [Items?.Stone]: {
                id: Items?.Stone,
                name: 'Pedra',
                weight: 2,
            },
        };
    }

    static get itemsList(): IItemDatabase[] {
        return Object.values(ItemDatabase.items);
    }

    static getItemById(id: Items): IItemDatabase {
        return ItemDatabase.items[id];
    }
}
