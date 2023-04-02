import { Component } from '@angular/core';
import { Building } from 'src/app/shared/model/game/base/building/building.model';
import { DebugService } from 'src/app/shared/services/debug.service';
import { BuildingBusiness } from 'src/app/shared/business/building.business';
import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Task } from 'src/app/shared/model/game/base/building/task.model';
import { BaseBusiness } from 'src/app/shared/business/base.business';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
    constructor(
        private buildingBusiness: BuildingBusiness,
        private baseBusiness: BaseBusiness,
        private debugService: DebugService
    ) {}

    get buildings(): Building[] {
        return this.buildingBusiness.buildings;
    }

    createFarm(): void {
        this.debugService.createBuilding(Buildings.Farm);
    }

    createHouse(): void {
        this.debugService.createBuilding(Buildings.House);
    }

    createKitchen(): void {
        this.debugService.createBuilding(Buildings.Kitchen);
    }

    createReadyKitchen(): void {
        this.debugService.createReadyBuilding(Buildings.Kitchen);
    }

    log(item: Building): void {
        console.log(item);
    }

    toggleAvailableTask(task: Task): void {
        task.available
            ? this.baseBusiness.disableTaskOfBuilding(task)
            : this.baseBusiness.enableTaskOfBuilding(task);
    }

    addTask(item: Building): void {
        this.buildingBusiness.addTask(item.id, Tasks.RefeicaoSimples);
    }
}
