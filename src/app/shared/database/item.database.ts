import { Itens } from '../interface/enums/item.enum';

export interface IItemDatabase {
    id: Itens;
    name: string;
}

export class ItemDatabase {
    constructor() {}

    static get items(): { [key in Itens]: IItemDatabase } {
        return {
            [Itens?.None]: {
                id: Itens?.None,
                name: 'None',
            },
            [Itens?.Meat]: {
                id: Itens?.Meat,
                name: 'Carne',
            },
            [Itens?.RefeicaoSimples]: {
                id: Itens?.RefeicaoSimples,
                name: 'Refeição Simples',
            },
        };
    }

    static get itemsList(): IItemDatabase[] {
        return Object.values(ItemDatabase.items);
    }

    static getItemById(id: Itens): IItemDatabase {
        return ItemDatabase.items[id];
    }
}
