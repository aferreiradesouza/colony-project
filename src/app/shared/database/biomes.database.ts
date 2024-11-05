/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Biomes } from '../interface/enums/biomes.enum';

export interface IBiomesDatabase {
    id: Biomes;
}

export class BiomesDatabase {
    constructor() {}

    static get biomes(): { [key in Biomes]: IBiomesDatabase } {
        return {
            [Biomes?.Forest]: {
                id: Biomes?.Forest,
            },
            [Biomes?.Lake]: {
                id: Biomes?.Lake,
            },
            [Biomes?.Normal]: {
                id: Biomes?.Normal,
            },
        };
    }

    static get biomesList(): IBiomesDatabase[] {
        return Object.values(BiomesDatabase.biomes);
    }

    static getBuildingById(id: Biomes): IBiomesDatabase {
        return BiomesDatabase.biomes[id];
    }
}
