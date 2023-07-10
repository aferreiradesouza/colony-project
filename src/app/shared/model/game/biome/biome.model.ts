import { Biomes } from 'src/app/shared/interface/enums/biomes.enum';

interface IBiome {
    type: Biomes;
}

export class Biome {
    type: Biomes;

    constructor(data: IBiome) {
        this.type = data.type;
    }
}
