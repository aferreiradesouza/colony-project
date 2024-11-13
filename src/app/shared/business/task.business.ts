import { Injectable } from '@angular/core';
import { Tasks } from '../interface/enums/tasks.enum';
import { TaskDatabase, ProcessQueue } from '../database/task.database';
import { Task } from '../model/game/base/building/task.model';
import { Building } from '../model/game/base/building/building.model';
import { Items } from '../interface/enums/item.enum';
import { EfficiencyBusiness } from './efficiency.business';
import { Settler } from '../model/game/base/settler/settler.model';
import { Business } from './business';
import { Process } from '../interface/enums/process.enum';
import { Item } from '../model/game/base/building/storage/item.model';
import { Skill } from '../interface/enums/skill.enum';

@Injectable({ providedIn: 'root' })
export class TaskBusiness {
    constructor() {}

    addTask(idBuilding: string, tasks: Tasks): void {
        const building = Business.buildingBusiness.getBuildingById(idBuilding);
        const task = TaskDatabase.getTaskById(tasks);
        building?.tasks.push(new Task(task));
    }

    startTask(task: Task, building: Building, settler: Settler): void {
        if (!this.canStartTask(task, building, settler)) return;
        if (
            this.canStartTaskWithExistingProcess({
                task,
                building,
                settler,
            })
        ) {
            this.startStepProcess(building, task, settler);
        } else {
            this.startProcess(building, task, settler);
        }
        // console.log('oi');
        // task.startTaskInterval = setInterval(() => {
        //     if (task.timeLeft > 0) {
        //         task.timeLeft =
        //             task.timeLeft - 1000 < 0 ? 0 : task.timeLeft - 1000;
        //         return;
        //     }
        //     task.timeLeft = timeWithEfficienty;
        //     if (task.consumption.length) {
        //         task.consumption.forEach((e) => {
        //             this.buildingBusiness.useMaterialInInventory(
        //                 building,
        //                 e.id,
        //                 e.amount,
        //                 task.guid
        //             );
        //         });
        //     }
        //     this.buildingBusiness.onWorkAtStructure.emit(task);
        //     if (canStart(task)) {
        //         if (!task.consumption.length) return;
        //         clearInterval(task.startTaskInterval);
        //         if (
        //             !this.inventoryHasNecessaryMaterialsForTask(
        //                 building,
        //                 task
        //             ) &&
        //             !task.warnings?.length
        //         ) {
        //             this.buildingBusiness.taskBusiness.startGetItemFromStorageForTask(
        //                 building,
        //                 task,
        //                 timeWithEfficienty,
        //                 canStart,
        //                 settler
        //             );
        //         } else {
        //             this.startTask(
        //                 task,
        //                 timeWithEfficienty,
        //                 canStart,
        //                 building,
        //                 settler
        //             );
        //         }
        //     }
        // }, 1000);
    }

    canStartTaskWithExistingProcess(data: {
        task: Task;
        building: Building;
        settler: Settler;
    }): boolean {
        let canStart = true;
        if (!data.task.currentProcess) {
            canStart = false;
            return canStart;
        }
        return canStart;
    }

    canStartTask(task: Task, building: Building, settler: Settler): boolean {
        // const warnings = task.requirements && task.requirements(task);
        // if (warnings?.length) {
        //     task.addWarning(warnings);
        //     Business.baseBusiness.unassignSettler(building.id, settler.id);
        //     this.stop(task);
        //     return false;
        // }
        return true;
    }

    startProcess(building: Building, task: Task, settler: Settler): void {
        task.changeCurrentProcess(task.processQueue[0].id);
        this.startStepProcess(building, task, settler);
    }

    nextProcess(task: Task, building: Building, settler: Settler): void {
        const index = task.processQueue.findIndex(
            (e) => e.id === task.currentProcess
        );
        if (index > -1 && index < task.processQueue.length - 1) {
            const newProcess = task.processQueue[index + 1];
            task.changeCurrentProcess(newProcess.id);
            this.startStepProcess(building, task, settler);
        } else {
            this.restartProcess(task, building, settler);
        }
    }

    restartProcess(task: Task, building: Building, settler: Settler): void {
        task.changeCurrentProcess(task.processQueue[0].id);
        this.startTask(task, building, settler);
        console.log('restartProcess');
    }

    startStepProcess(building: Building, task: Task, settler: Settler): void {
        switch (task.currentProcess) {
            case Process.TransportarDoDeposito:
                this.startGetItemFromStorageForTask(building, task, settler);
                break;

            case Process.Produzir:
                this.produce(building, task, settler);
                break;

            case Process.TransportarParaDeposito:
                this.startGetItemFromTaskToStorage(building, task, settler);
                break;

            default:
                console.log('default');
                break;
        }
    }

    stop(task: Task): void {
        clearInterval(task.startTaskInterval);
        clearInterval(task.getItemFromTaskInterval);
        clearInterval(task.getItemFromStorageInterval);
    }

    produce(building: Building, task: Task, settler: Settler): void {
        const timeWithEfficienty = EfficiencyBusiness.calculateEfficiency(
            task.baseTimeMs,
            task.currentProcessData!.skill,
            settler
        );
        task.timeLeft = timeWithEfficienty;
        task.startTaskInterval = setInterval(() => {
            if (task.timeLeft > 0) {
                task.timeLeft =
                    task.timeLeft - 1000 < 0 ? 0 : task.timeLeft - 1000;
                return;
            }
            task.timeLeft = timeWithEfficienty;
            if (task.consumption.length) {
                task.consumption.forEach((e) => {
                    building.useMaterialInInventory(
                        e.id,
                        e.amount,
                        task.guid
                    );
                });
            }
            Business.buildingBusiness.generateResource(task, building);
            clearInterval(task.startTaskInterval);
            this.nextProcess(task, building, settler);
            // if (canStart(task)) {
            //     if (!task.consumption.length) return;
            //     clearInterval(task.startTaskInterval);
            //     if (
            //         !this.inventoryHasNecessaryMaterialsForTask(
            //             building,
            //             task
            //         ) &&
            //         !task.warnings?.length
            //     ) {
            //         this.buildingBusiness.taskBusiness.startGetItemFromStorageForTask(
            //             building,
            //             task,
            //             timeWithEfficienty,
            //             canStart,
            //             settler
            //         );
            //     } else {
            //         this.startTask(
            //             task,
            //             timeWithEfficienty,
            //             canStart,
            //             building,
            //             settler
            //         );
            //     }
            // }
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
        Business.baseBusiness.getMaterial({
            amount: 10,
            building,
            id: itemToPickup.type,
            taskId: task.guid,
        });
    }

    public startGetItemFromStorageForTask(
        building: Building,
        task: Task,
        settler: Settler
    ): void {
        const time = EfficiencyBusiness.calculateEfficiency(
            500,
            Skill.Agility,
            settler
        );
        task.getItemFromStorageInterval = setInterval(() => {
            this.whichItemWillPickUpForTask(building, task);
            if (this.inventoryHasNecessaryMaterialsForTask(building, task)) {
                // this.startTask(task, building, settler);
                clearInterval(task.getItemFromStorageInterval);
                this.nextProcess(task, building, settler);
            }
        }, time);
    }

    getTaskBuildingBySettler(
        building: Building,
        idSettler: string
    ): Task | null {
        return building.tasks.find((e) => e.assignedTo === idSettler) ?? null;
    }

    getBuildingByTaskAssignedToSettler(idSettler: string): Building | null {
        return (
            Business.buildingBusiness.buildings.find((e) =>
                e.tasks.find((f) => f.assignedTo === idSettler)
            ) ?? null
        );
    }

    hasTasksInProgress(building: Building): boolean {
        return !!building.tasks.filter((e) => e.hasWorkInProgress).length;
    }

    startGetItemFromTaskToStorage(
        building: Building,
        task: Task,
        settler: Settler
    ): void {
        const time = EfficiencyBusiness.calculateEfficiency(
            500,
            Skill.Agility,
            settler
        );
        task.getItemFromTaskInterval = setInterval(() => {
            if (
                this.inventoryHasNecessaryMaterialsToTakeToStorage(
                    task,
                    building
                )
            ) {
                task.resourceGenerated.forEach((e) => {
                    building.useMaterialInInventory(
                        e.id,
                        e.amount,
                        task.guid
                    );
                    Business.storageBusiness.addItem(
                        new Item({
                            amount: e.amount,
                            type: e.id,
                        })
                    );
                });
                this.nextProcess(task, building, settler);
            }
            clearInterval(task.getItemFromTaskInterval);
        }, time);
    }

    inventoryHasNecessaryMaterialsToTakeToStorage(
        task: Task,
        building: Building
    ): boolean {
        let hasItem = true;
        for (const item of task.resourceGenerated) {
            const itemInInventory = building.inventory.filter((e) => {
                e.type === item.id && e.taskId === task.guid;
            });
            if (!itemInInventory) {
                hasItem = false;
                break;
            }
        }
        return hasItem;
    }
}
