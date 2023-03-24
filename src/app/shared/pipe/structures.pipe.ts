import { Pipe, PipeTransform } from '@angular/core';
import { Constructions } from '../model/game/base/construction.model';

@Pipe({
    name: 'structure',
})
export class StructurePipe implements PipeTransform {
    transform(value: Constructions): string {
        return this._getConstruction(value);
    }

    private _getConstruction(construction: Constructions): string {
        const constructions: { [key in Constructions]: string } = {
            [Constructions.Factory]: 'Fábrica',
            [Constructions.Farm]: 'Fazenda',
            [Constructions.House]: 'Casa',
            [Constructions.Kitchen]: 'Cozinha',
            [Constructions.Storage]: 'Armazém',
        };
        return constructions[construction];
    }
}
