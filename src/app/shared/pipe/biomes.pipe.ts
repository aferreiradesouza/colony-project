import { Pipe, PipeTransform } from '@angular/core';
import { Biomes } from '../interface/enums/biomes.enum';
import { BiomesDatabase } from '../database/biomes.database';

@Pipe({
    name: 'biome',
})
export class BiomePipe implements PipeTransform {
    transform(value: Biomes): string {
        return BiomesDatabase.getBiomeById(value).name;
    }
}
