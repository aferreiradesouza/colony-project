import { Injectable } from '@angular/core';
import { Itens } from '../interface/enums/item.enum';
import { Job } from '../interface/enums/job.enum';
import { Building } from '../model/game/base/building/building.model';
import { Item } from '../model/game/base/building/storage/item.model';
import { HelperService } from '../services/helpers.service';
import { LogService } from '../services/log.service';
import { BuildingBusiness } from './building.business';
import { SettlersBusiness } from './settlers.business';
import { StorageBusiness } from './storage.business';

@Injectable({ providedIn: 'root' })
export class BaseBusiness {
    constructor(
        private buildingBusiness: BuildingBusiness,
        private settlersBusiness: SettlersBusiness,
        private storageBusiness: StorageBusiness
    ) {
        this._startEvents();
    }

    getBuildingAssignedTo(idSettler: string): Building | null {
        return this.buildingBusiness.getBuildingBySettler(idSettler);
    }

    assingSettler(
        idSettler: string,
        idBuilding: string,
        job: Job | null
    ): void {
        this.buildingBusiness.assignSettler(idSettler, idBuilding);
        this.settlersBusiness.assignWork(
            idSettler,
            idBuilding,
            job ?? Job.None
        );
    }

    unassignSettler(idBuilding: string, idSettler: string): void {
        this.buildingBusiness.unassignSettler(idBuilding);
        this.settlersBusiness.unassignWork(idSettler);
    }

    private _startEvents(): void {
        this._startOnDoneBuilding();
        this._startOnWorkAtStructure();
    }

    private _startOnDoneBuilding(): void {
        this.buildingBusiness.onDoneBuilding.subscribe((event) => {
            LogService.add('Construção finalizada');
            this.settlersBusiness.unassignWork(event.idSettler);
        });
    }

    private _startOnWorkAtStructure(): void {
        this.buildingBusiness.onWorkAtStructure.subscribe((event) => {
            LogService.add(`Trabalhou no job: ${event.job}`);
            this.storageBusiness.addItem(
                new Item({
                    amount: 1,
                    id: HelperService.guid,
                    type: Itens.Meat,
                })
            );
        });
    }
}
