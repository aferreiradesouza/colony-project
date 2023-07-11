import { Itens } from '../interface/enums/item.enum';

export interface IItemDatabase {
    id: Itens;
    name: string;
    weight: number;
}

export class ItemDatabase {
    constructor() {}

    static get items(): { [key in Itens]: IItemDatabase } {
        return {
            [Itens?.Meat]: {
                id: Itens?.Meat,
                name: 'Carne',
                weight: 0.2,
            },
            [Itens?.RefeicaoSimples]: {
                id: Itens?.RefeicaoSimples,
                name: 'Refeição Simples',
                weight: 0.8,
            },
            [Itens?.RefeicaoCompleta]: {
                id: Itens?.RefeicaoCompleta,
                name: 'Refeição Completa',
                weight: 1,
            },
            [Itens?.Wood]: {
                id: Itens?.Wood,
                name: 'Madeira',
                weight: 5,
            },
            [Itens?.Stone]: {
                id: Itens?.Stone,
                name: 'Pedra',
                weight: 7,
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
