import { Pipe, PipeTransform } from '@angular/core';
import { STRUCTURES } from '../constants/construction.constant';
import { Constructions } from '../model/game/base/construction.model';

@Pipe({
    name: 'structure',
})
export class StructurePipe implements PipeTransform {
    transform(value: Constructions): string {
        return STRUCTURES[value];
    }
}
