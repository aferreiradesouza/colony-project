import { BiomesDatabase } from 'src/app/shared/database/biomes.database';
import { Biomes } from 'src/app/shared/interface/enums/biomes.enum';

interface IBiome {
    type: Biomes;
    animals?: number;
    wood?: number;
    stone?: number;
    cultivableLand?: number;
    water?: number;
}

export class Biome {
    type: Biomes;
    animals: number;
    wood: number;
    stone: number;
    cultivableLand: number;
    water: number;

    constructor(data: IBiome) {
        const database = BiomesDatabase.getBiomeById(data.type);
        this.type = data.type;
        this.animals = data.animals ?? database.animals;
        this.wood = data.wood ?? database.wood;
        this.stone = data.stone ?? database.stone;
        this.cultivableLand = data.cultivableLand ?? database.cultivableLand;
        this.water = data.water ?? database.water;
    }
}
