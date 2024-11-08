import { Injectable } from '@angular/core';
import { Business } from './business';
import { Biome } from '../model/game/biome/biome.model';
import { BiomesDatabase } from '../database/biomes.database';

@Injectable({ providedIn: 'root' })
export class BiomesBusiness {
    constructor() {}

    get biomes(): Biome[] | null {
        return Business.gameBusiness.game.biomes;
    }
}
