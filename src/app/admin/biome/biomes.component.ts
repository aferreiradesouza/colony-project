import { Component } from '@angular/core';
import { BaseBusiness } from 'src/app/shared/business/base.business';
import { BuildingBusiness } from 'src/app/shared/business/building.business';
import { Biomes } from 'src/app/shared/interface/enums/biomes.enum';
import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';
import { Building } from 'src/app/shared/model/game/base/building/building.model';
import { Task } from 'src/app/shared/model/game/base/building/task.model';
import { DebugService } from 'src/app/shared/services/debug.service';

@Component({
    selector: 'app-biomes',
    templateUrl: './biomes.component.html',
    styleUrls: ['./biomes.component.scss'],
})
export class BiomesComponent {
    constructor(
        public debugService: DebugService,
        private buildingBusiness: BuildingBusiness,
        private baseBusiness: BaseBusiness
    ) {}

    get buildings(): Building[] {
        return this.buildingBusiness.buildings.filter(
            (e) => e.biome === Biomes.Forest
        );
    }

    addCamping(): void {
        this.debugService.createBuilding(Buildings.Camping, Biomes.Forest);
    }

    addQuarry(): void {
        this.debugService.createBuilding(Buildings.Quarry, Biomes.Forest);
    }

    addHunterHouse(): void {
        this.debugService.createBuilding(Buildings.HunterHouse, Biomes.Forest);
    }

    toggleAvailableTask(task: Task): void {
        task.available
            ? this.baseBusiness.disableTaskOfBuilding(task)
            : this.baseBusiness.enableTaskOfBuilding(task);
    }

    addTask(building: Building): void {
        if (building.type === Buildings.Camping) {
            this.buildingBusiness.addTask(building.id, Tasks.ObterMadeira);
        } else if (building.type === Buildings.Quarry) {
            this.buildingBusiness.addTask(building.id, Tasks.ObterPedra);
        } else if (building.type === Buildings.HunterHouse) {
            this.buildingBusiness.addTask(building.id, Tasks.ObterCarne);
        }
    }
}
