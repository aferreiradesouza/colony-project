import { Component } from '@angular/core';
import { BaseBusiness } from 'src/app/shared/business/base.business';
import { BuildingBusiness } from 'src/app/shared/business/building.business';
import { TaskBusiness } from 'src/app/shared/business/task.business';
import { Biome } from 'src/app/shared/model/game/biome/biome.model';
import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';
import { Building } from 'src/app/shared/model/game/base/building/building.model';
import { Task } from 'src/app/shared/model/game/base/building/task.model';
import { DebugService } from 'src/app/shared/services/debug.service';
import { Business } from 'src/app/shared/business/business';

@Component({
    selector: 'app-biomes',
    templateUrl: './biomes.component.html',
    styleUrls: ['./biomes.component.scss'],
})
export class BiomesComponent {
    constructor(public debugService: DebugService) {}

    get biomes(): Biome[] {
        return Business.biomesBusiness.biomes ?? [];
    }
}
