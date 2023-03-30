import { Pipe, PipeTransform } from '@angular/core';
import { BuildingDatabase } from '../database/building.database';
import { Buildings } from '../interface/enums/buildings.enum';

@Pipe({
    name: 'structure',
})
export class StructurePipe implements PipeTransform {
    transform(value: Buildings): string {
        return BuildingDatabase.getBuildingById(value).name;
    }
}
