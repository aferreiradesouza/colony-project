import { Injectable } from '@angular/core';
import { Job } from '../interface/enums/job.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import { Building } from '../model/game/base/building/building.model';
import { Task } from '../model/game/base/building/task.model';
import { LogService } from '../services/log.service';
import { BuildingBusiness } from './building.business';
import { SettlersBusiness } from './settlers.business';
import { StorageBusiness } from './storage.business';
import { RequerimentsWarning } from '../database/task.database';
import { Item } from '../model/game/base/building/storage/item.model';
import { HelperService } from '../services/helpers.service';

@Injectable({ providedIn: 'root' })
export class BaseBusiness {
    constructor(
        public buildingBusiness: BuildingBusiness,
        public settlersBusiness: SettlersBusiness,
        public storageBusiness: StorageBusiness
    ) {
        this.startEvents();
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
        task?: Tasks,
        uniqueIdTask?: string
    ): void {
        const building = this.buildingBusiness.getBuildingById(idBuilding);
        if (building?.status === 'done' && task && uniqueIdTask) {
            this.assignDoneBuilding(
                idSettler,
                idBuilding,
                job,
                task,
                uniqueIdTask
            );
        } else {
            this.assignNotDoneBuilding(idSettler, idBuilding, job);
        }
    }

    private assignDoneBuilding(
        idSettler: string,
        idBuilding: string,
        job: Job | null,
        task: Tasks,
        uniqueIdTask: string
    ): void {
        const settler = this.settlersBusiness.getSettlerById(idSettler)!;
        this.buildingBusiness.work({
            settler,
            idBuilding,
            task,
            uniqueIdTask,
            canStartTask: (task: Task): boolean => {
                const warnings =
                    task.requirements && task.requirements(this, task);
                if (warnings?.length) {
                    task.addWarning(warnings);
                    this.unassignSettler(idBuilding, idSettler);
                    clearInterval(task.startTaskInterval);
                    return true;
                }
                return false;
            },
        });
        this.settlersBusiness.assignWork(
            settler.id,
            idBuilding,
            job ?? Job.None
        );
    }

    private assignNotDoneBuilding(
        idSettler: string,
        idBuilding: string,
        job: Job | null
    ): void {
        const building = this.buildingBusiness.getBuildingById(idBuilding);
        building?.clearWarning();
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
                task.id,
                task.guid
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

    addWarningTask(task: Task, errors: RequerimentsWarning): void {
        task.warnings = errors ?? [];
    }

    private startEvents(): void {
        this.startOnDoneBuilding();
        this.startOnWorkAtStructure();
        this.startOnUseMaterial();
        this.startOnGetMaterial();
    }

    private startOnDoneBuilding(): void {
        this.buildingBusiness.onDoneBuilding.subscribe((event) => {
            LogService.add('Construção finalizada');
            this.settlersBusiness.unassignWork(event.idSettler);
        });
    }

    private startOnWorkAtStructure(): void {
        this.buildingBusiness.onWorkAtStructure.subscribe((event) => {
            LogService.add(`Criou: ${event.name}`);
            event.resourceGenerated.forEach((e) => {
                this.storageBusiness.addItem(
                    new Item({
                        amount: e.amount,
                        id: HelperService.guid,
                        type: e.id,
                    })
                );
            });
        });
    }

    private startOnUseMaterial(): void {
        this.buildingBusiness.onUseMaterial.subscribe((event) => {
            event.forEach((e) => {
                this.storageBusiness.useResource(e.id, e.amount);
            });
        });
    }

    private startOnGetMaterial(): void {
        this.buildingBusiness.onGetMaterial.subscribe((event) => {
            const item = this.storageBusiness.getResource(
                event.id,
                event.amount
            );
            if (item && event.taskId) item.taskId = event.taskId;
            if (!item) {
                const errors =
                    (event.building.requirements &&
                        event.building.requirements(this, event.building)) ??
                    [];
                clearInterval(event.building.getItemFromStorageInterval);
                this.settlersBusiness.unassignWork(event.building.assignedTo!);
                this.buildingBusiness.unassignSettler(event.building.id);
                event.building.addWarning(errors);
                return;
            }
            this.buildingBusiness.addItemInInventory(
                event.building.id,
                item,
                event.taskId
            );
        });
    }
}
