import { Component } from '@angular/core';
import { BaseBusiness } from 'src/app/shared/business/base.business';
import { BuildingBusiness } from 'src/app/shared/business/building.business';
import { Building } from 'src/app/shared/model/game/base/building/building.model';

@Component({
    selector: 'app-to-do-list-shortcut-tab',
    templateUrl: './to-do-list-shortcut-tab.component.html',
    styleUrls: ['./to-do-list-shortcut-tab.component.scss'],
})
export class ToDoListShortcutTabComponent {
    constructor(
        private baseService: BaseBusiness,
        private buildingBusiness: BuildingBusiness
    ) {}

    get contructions(): Building[] {
        return this.buildingBusiness.buildings.filter(
            (e) => e.status === 'not-started' || e.status === 'building'
        );
    }
}
