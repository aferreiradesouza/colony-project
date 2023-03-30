import { Injectable } from '@angular/core';
import { Itens } from '../interface/enums/item.enum';
import { Job } from '../interface/enums/job.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import { Building } from '../model/game/base/building/building.model';
import { Item } from '../model/game/base/building/storage/item.model';
import { Task } from '../model/game/base/building/task.model';
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
        return (
            this.buildingBusiness.getBuildingBySettler(idSettler) ??
            this.buildingBusiness.getBuildingByTaskAssignedToSettler(
                idSettler
            ) ??
            null
        );
    }

    getTaskBuildingAssignedTo(idSettler: string): Task | null {
        const building = this.getBuildingAssignedTo(idSettler);
        if (!building) return null;
        return (
            this.buildingBusiness.getTaskBuildingBySettler(
                building,
                idSettler
            ) ?? null
        );
    }

    assingSettler(
        idSettler: string,
        idBuilding: string,
        job: Job | null,
        task?: Tasks
    ): void {
        const building = this.buildingBusiness.getBuildingById(idBuilding);
        if (building?.status === 'done' && task) {
            this.assignDoneBuilding(idSettler, idBuilding, job, task);
        } else {
            this.assignNotDoneBuilding(idSettler, idBuilding, job);
        }
    }

    private assignDoneBuilding(
        idSettler: string,
        idBuilding: string,
        job: Job | null,
        task: Tasks
    ): void {
        this.buildingBusiness.work(idSettler, idBuilding, task);
        this.settlersBusiness.assignWork(
            idSettler,
            idBuilding,
            job ?? Job.None
        );
    }

    private assignNotDoneBuilding(
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
        const building = this.buildingBusiness.getBuildingById(idBuilding);
        const task = this.getTaskBuildingAssignedTo(idSettler);
        if (building?.status === 'done' && task) {
            this.buildingBusiness.unassignSettlerAtDoneBuilding(
                idBuilding,
                task.id
            );
            this.settlersBusiness.unassignWork(idSettler);
        } else {
            this.buildingBusiness.unassignSettler(idBuilding);
            this.settlersBusiness.unassignWork(idSettler);
        }
    }

    disableTaskOfBuilding(task: Task): void {
        if (task.assignedTo)
            this.settlersBusiness.unassignWork(task.assignedTo);
        this.buildingBusiness.disableTaskOfBuilding(task);
    }

    enableTaskOfBuilding(task: Task): void {
        this.buildingBusiness.enableTaskOfBuilding(task);
    }

    private _startEvents(): void {
        this.startOnDoneBuilding();
        this.startOnWorkAtStructure();
    }

    private startOnDoneBuilding(): void {
        this.buildingBusiness.onDoneBuilding.subscribe((event) => {
            LogService.add('Construção finalizada');
            this.settlersBusiness.unassignWork(event.idSettler);
        });
    }

    private startOnWorkAtStructure(): void {
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
