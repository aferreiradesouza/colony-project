import { Injectable } from '@angular/core';
import { Job } from '../interface/enums/job.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import { Building } from '../model/game/base/building/building.model';
import { Task } from '../model/game/base/building/task.model';
import { LogService } from '../services/log.service';
import { RequerimentsWarning } from '../database/task.database';
import { Item } from '../model/game/base/building/storage/item.model';
import { HelperService } from '../services/helpers.service';
import { Business } from './business';
import { Items } from '../interface/enums/item.enum';

@Injectable({ providedIn: 'root' })
export class BaseBusiness {
    constructor() {}

    getBuildingAssignedTo(idSettler: string): Building | null {
        return (
            Business.buildingBusiness.getBuildingBySettler(idSettler) ??
            Business.taskBusiness.getBuildingByTaskAssignedToSettler(
                idSettler
            ) ??
            null
        );
    }

    getTaskBuildingAssignedTo(idSettler: string): Task | null {
        const building = this.getBuildingAssignedTo(idSettler);
        if (!building) return null;
        return (
            Business.taskBusiness.getTaskBuildingBySettler(
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
        const building = Business.buildingBusiness.getBuildingById(idBuilding);
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
        const settler = Business.settlersBusiness.getSettlerById(idSettler)!;
        Business.buildingBusiness.work({
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
                    return false;
                }
                return true;
            },
        });
        Business.settlersBusiness.assignWork(
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
        const building = Business.buildingBusiness.getBuildingById(idBuilding);
        const settler = Business.settlersBusiness.getSettlerById(idSettler);
        if (!settler) return;
        building?.clearWarning();
        Business.buildingBusiness.assignSettler(settler, idBuilding);
        Business.settlersBusiness.assignWork(
            idSettler,
            idBuilding,
            job ?? Job.None
        );
    }

    unassignSettler(idBuilding: string, idSettler: string): void {
        const building = Business.buildingBusiness.getBuildingById(idBuilding);
        const task = this.getTaskBuildingAssignedTo(idSettler);
        if (building?.status === 'done' && task) {
            Business.buildingBusiness.unassignSettlerAtDoneBuilding(
                idBuilding,
                task.id,
                task.guid
            );
            Business.settlersBusiness.unassignWork(idSettler);
        } else {
            Business.buildingBusiness.unassignSettler(idBuilding);
            Business.settlersBusiness.unassignWork(idSettler);
        }
    }

    disableTaskOfBuilding(task: Task): void {
        if (task.assignedTo)
            Business.settlersBusiness.unassignWork(task.assignedTo);
        Business.taskBusiness.disableTaskOfBuilding(task);
    }

    enableTaskOfBuilding(task: Task): void {
        Business.taskBusiness.enableTaskOfBuilding(task);
    }

    addWarningTask(task: Task, errors: RequerimentsWarning): void {
        task.warnings = errors ?? [];
    }

    doneBuilding(data: { id: string; idSettler: string }): void {
        LogService.add('Construção finalizada');
        Business.settlersBusiness.unassignWork(data.idSettler);
    }

    workAtStructure(data: Task): void {
        LogService.add(`Criou: ${data.name}`);
        data.resourceGenerated.forEach((e) => {
            Business.storageBusiness.addItem(
                new Item({
                    amount: e.amount,
                    id: HelperService.guid,
                    type: e.id,
                })
            );
        });
    }

    useMaterial(
        data: {
            id: Items;
            amount: number;
        }[]
    ): void {
        data.forEach((e) => {
            Business.storageBusiness.useResource(e.id, e.amount);
        });
    }

    getMaterial(data: {
        id: Items;
        amount: number;
        building: Building;
        taskId?: string | undefined;
    }): void {
        const item = Business.storageBusiness.getResource(data.id, data.amount);
        if (item && data.taskId) item.taskId = data.taskId;
        if (!item) {
            const errors =
                (data.building.requirements &&
                    data.building.requirements(this, data.building)) ??
                [];
            clearInterval(data.building.getItemFromStorageInterval);
            if (data.building.assignedTo)
                this.unassignSettler(
                    data.building.id,
                    data.building.assignedTo!
                );
            data.building.addWarning(errors);
            return;
        }
        Business.buildingBusiness.addItemInInventory(
            data.building.id,
            item,
            data.taskId
        );
    }
}
