import { Biomes } from '../../interface/enums/biomes.enum';
import { Base } from './base/base.model';
import { Biome } from './biome/biome.model';

export class Game {
    public id: string;
    public base: Base;
    public biomes: Biome[];

    constructor(game: { id: string; base: Base; biomes: Biome[] }) {
        this.id = game.id;
        this.base = new Base(game.base);
        this.biomes = game.biomes.map((e) => {
            return new Biome(e);
        });
    }
}
