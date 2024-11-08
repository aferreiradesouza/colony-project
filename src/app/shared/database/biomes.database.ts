/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Biomes } from '../interface/enums/biomes.enum';

export interface IBiomesDatabase {
    id: Biomes;
    name: string;
    animals: number;
    wood: number;
    stone: number;
    cultivableLand: number;
    water: number;
}

export class BiomesDatabase {
    constructor() {}

    static get biomes(): { [key in Biomes]: IBiomesDatabase } {
        return {
            [Biomes?.Forest]: {
                id: Biomes?.Forest,
                name: 'Floresta',
                animals: 20,
                cultivableLand: 80,
                stone: 400,
                wood: 2500,
                water: 500,
            },
            [Biomes?.Lake]: {
                id: Biomes?.Lake,
                name: 'Lago',
                animals: 20,
                cultivableLand: 80,
                stone: 400,
                wood: 2500,
                water: 8000,
            },
        };
    }

    static get biomesList(): IBiomesDatabase[] {
        return Object.values(BiomesDatabase.biomes);
    }

    static getBiomeById(id: Biomes): IBiomesDatabase {
        return BiomesDatabase.biomes[id];
    }
}
