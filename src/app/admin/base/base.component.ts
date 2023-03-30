import { Component } from '@angular/core';
import { Building } from 'src/app/shared/model/game/base/building/building.model';
import { DebugService } from 'src/app/shared/services/debug.service';
import { BuildingBusiness } from 'src/app/shared/business/building.business';
import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
    constructor(
        private buildingBusiness: BuildingBusiness,
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
}
