import { Injectable } from '@angular/core';
import { BuildingBusiness } from './building.business';
import { GameBusiness } from './game.business';
import { Tasks } from '../interface/enums/tasks.enum';
import { TaskDatabase } from '../database/task.database';
import { Task } from '../model/game/base/building/task.model';
import { Building } from '../model/game/base/building/building.model';
import { Items } from '../interface/enums/item.enum';

@Injectable({ providedIn: 'root' })
export class TaskBusiness {
    public buildingBusiness!: BuildingBusiness;

    constructor(private gameService: GameBusiness) {}

    addTask(idBuilding: string, tasks: Tasks): void {
        const building = this.buildingBusiness.getBuildingById(idBuilding);
        const task = TaskDatabase.getTaskById(tasks);
        building?.tasks.push(new Task(task));
    }

    startTask(
        task: Task,
        timeWithEfficienty: number,
        canStart: (task: Task) => boolean,
        building: Building
    ): void {
        task.startTaskInterval = setInterval(() => {
            if (task.timeLeft > 0) {
                task.timeLeft =
                    task.timeLeft - 1000 < 0 ? 0 : task.timeLeft - 1000;
                return;
            }
            task.timeLeft = timeWithEfficienty;
            if (task.consumption.length) {
                task.consumption.forEach((e) => {
                    this.buildingBusiness.useMaterialInInventory(
                        building,
                        e.id,
                        e.amount,
                        task.guid
                    );
                });
            }
            this.buildingBusiness.onWorkAtStructure.emit(task);
            if (canStart(task)) {
                if (!task.consumption.length) return;
                clearInterval(task.startTaskInterval);
                if (
                    !this.inventoryHasNecessaryMaterialsForTask(
                        building,
                        task
                    ) &&
                    !task.warnings?.length
                ) {
                    this.buildingBusiness.taskBusiness.startGetItemFromStorageForTask(
                        building,
                        task,
                        timeWithEfficienty,
                        canStart
                    );
                } else {
                    this.startTask(
                        task,
                        timeWithEfficienty,
                        canStart,
                        building
                    );
                }
            }
        }, 1000);
    }

    getTaskByBuilding(
        building: Building,
        task: Tasks,
        uniqueIdTask: string
    ): Task {
        return building.tasks.find(
            (e) => e.id === task && e.guid === uniqueIdTask
        )!;
    }

    disableTaskOfBuilding(task: Task): void {
        task.available = false;
        task.assignedTo = null;
        clearInterval(task.startTaskInterval);
        clearInterval(task.getItemFromStorageInterval);
        task.clearWarning();
    }

    enableTaskOfBuilding(task: Task): void {
        task.available = true;
    }

    inventoryHasNecessaryMaterialsForTask(
        building: Building,
        task: Task
    ): boolean {
        let hasItem = true;
        for (const resource of task.consumption) {
            const itemInInventory = building.inventory.find(
                (e) => e.type === resource.id && e.taskId === task.guid
            );
            if (
                !itemInInventory ||
                (building.inventory.find((e) => e.type === resource.id) &&
                    itemInInventory.amount < resource.amount)
            ) {
                hasItem = false;
                break;
            }
        }
        return hasItem;
    }

    whichItemWillPickUpForTask(building: Building, task: Task): void {
        let itemToPickup:
            | {
                  type: Items;
                  amount: number;
              }
            | undefined;
        for (const resourceNecessary of task.consumption) {
            const hasItem = building.inventory.find(
                (e) =>
                    e.type === resourceNecessary.id &&
                    e.amount >= resourceNecessary.amount &&
                    e.taskId === task.guid
            );
            if (!hasItem) {
                const itemInInventory = building.inventory.find(
                    (e) =>
                        e.type === resourceNecessary.id &&
                        e.amount <= resourceNecessary.amount
                );
                if (!itemInInventory) {
                    itemToPickup = {
                        type: resourceNecessary.id,
                        amount: 10,
                    };
                } else {
                    itemToPickup = {
                        type: itemInInventory!.type,
                        amount:
                            itemInInventory!.amount + 10 >
                            resourceNecessary.amount
                                ? itemInInventory!.amount -
                                  resourceNecessary.amount
                                : 10,
                    };
                }
            }
        }
        if (!itemToPickup) return;
        this.buildingBusiness.onGetMaterial.emit({
            amount: 10,
            building,
            id: itemToPickup.type,
            taskId: task.guid,
        });
    }

    public startGetItemFromStorageForTask(
        building: Building,
        task: Task,
        timeWithEfficienty: number,
        canStartTask: (task: Task) => boolean
    ): void {
        task.getItemFromStorageInterval = setInterval(() => {
            this.whichItemWillPickUpForTask(building, task);
            if (this.inventoryHasNecessaryMaterialsForTask(building, task)) {
                this.startTask(
                    task,
                    timeWithEfficienty,
                    canStartTask,
                    building
                );
                clearInterval(task.getItemFromStorageInterval);
            }
        }, 200);
    }

    getTaskBuildingBySettler(
        building: Building,
        idSettler: string
    ): Task | null {
        return building.tasks.find((e) => e.assignedTo === idSettler) ?? null;
    }

    getBuildingByTaskAssignedToSettler(idSettler: string): Building | null {
        return (
            this.buildingBusiness.buildings.find((e) =>
                e.tasks.find((f) => f.assignedTo === idSettler)
            ) ?? null
        );
    }
}
