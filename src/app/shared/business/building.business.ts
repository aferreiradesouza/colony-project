import { EventEmitter, Injectable } from '@angular/core';
import { BuildingDatabase } from '../database/building.database';
import { Tasks } from '../interface/enums/tasks.enum';
import {
    Building,
    BuildingStatus,
} from '../model/game/base/building/building.model';
import { Task } from '../model/game/base/building/task.model';
import { NotificationService } from '../services/notification.service';
import { GameBusiness } from './game.business';
import { TaskDatabase } from '../database/task.database';
import { Itens } from '../interface/enums/item.enum';
import { Settler } from '../model/game/base/settler/settler.model';
import { EfficiencyBusiness } from './efficiency.business';
import { Item } from '../model/game/base/building/storage/item.model';
import { HelperService } from '../services/helpers.service';
import { Skill } from '../model/game/base/settler/skill.model';

@Injectable({ providedIn: 'root' })
export class BuildingBusiness {
    public onDoneBuilding = new EventEmitter<{
        id: string;
        idSettler: string;
    }>();
    public onChangeStatus = new EventEmitter<{
        id: string;
        status: BuildingStatus;
    }>();
    public onWorkAtStructure = new EventEmitter<Task>();
    public onUseMaterial = new EventEmitter<{ id: Itens; amount: number }[]>();
    public onGetMaterial = new EventEmitter<{
        id: Itens;
        amount: number;
        building: Building;
        taskId?: string;
    }>();

    constructor(
        private gameService: GameBusiness,
        private notificationService: NotificationService
    ) {}

    get buildings(): Building[] {
        const buildings = [...this.gameService.game.base.buildings];
        if (this.gameService.game.base.storage)
            buildings.push(this.gameService.game.base.storage);
        return buildings;
    }

    add(data: Building): void {
        this.gameService.game.base.buildings.push(data);
    }

    setBuilding(building: Building[]): void {
        this.gameService.game.base.buildings = building;
    }

    getBuildingById(id: string): Building | null {
        return this.buildings.find((e) => e.id === id) ?? null;
    }

    getBuildingBySettler(id: string): Building | null {
        return this.buildings.find((e) => e.assignedTo === id) ?? null;
    }

    getBuildingByTaskAssignedToSettler(idSettler: string): Building | null {
        return (
            this.buildings.find((e) =>
                e.tasks.find((f) => f.assignedTo === idSettler)
            ) ?? null
        );
    }

    getTaskBuildingBySettler(
        building: Building,
        idSettler: string
    ): Task | null {
        return building.tasks.find((e) => e.assignedTo === idSettler) ?? null;
    }

    assignSettler(settler: Settler, idContruction: string): void {
        const building = this.getBuildingById(idContruction) as Building;
        building.assignedTo = settler.id;
        if (building.status === 'not-started') {
            this.build(building.id, settler);
        }
        if (building.status === 'paused') this.resume(idContruction, settler);
    }

    build(id: string, settler: Settler): void {
        const building = this.getBuildingById(id) as Building;
        if (!this.inventoryHasNecessaryMaterials(building)) {
            this.startGetItemFromStorage(building, settler);
        } else {
            this.startBuildingInterval(building, settler);
        }
        this.changeStatus(id, 'building');
    }

    addItemInInventory(id: string, item: Item, taskId?: string): void {
        const building = this.getBuildingById(id) as Building;
        const ItemOfStorage = this.getItemByType(item.type, building, taskId);
        if (ItemOfStorage) ItemOfStorage.amount += item.amount;
        else
            building.inventory.push({
                ...item,
                id: HelperService.guid,
            });
    }

    private getItemByType(
        type: Itens,
        building: Building,
        taskId?: string
    ): Item | null {
        return (
            building.inventory.find(
                (e) => e.type === type && (taskId ? e.taskId === taskId : true)
            ) ?? null
        );
    }

    private startGetItemFromStorage(
        building: Building,
        settler: Settler
    ): void {
        const time = EfficiencyBusiness.calculateEfficiency(
            500,
            Skill.Agility,
            settler
        );
        building.getItemFromStorageInterval = setInterval(() => {
            this.whichItemWillPickUp(building);
            if (this.inventoryHasNecessaryMaterials(building)) {
                this.startBuildingInterval(building, settler);
                clearInterval(building.getItemFromStorageInterval);
            }
        }, time);
    }

    private startGetItemFromStorageForTask(
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

    private whichItemWillPickUp(building: Building): void {
        let itemToPickup:
            | {
                  type: Itens;
                  amount: number;
              }
            | undefined;
        for (const resourceNecessary of building.resources) {
            const hasItem = building.inventory.find(
                (e) =>
                    e.type === resourceNecessary.id &&
                    e.amount >= resourceNecessary.amount
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
        this.onGetMaterial.emit({
            amount: 10,
            building,
            id: itemToPickup.type,
        });
    }

    private whichItemWillPickUpForTask(building: Building, task: Task): void {
        let itemToPickup:
            | {
                  type: Itens;
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
        this.onGetMaterial.emit({
            amount: 10,
            building,
            id: itemToPickup.type,
            taskId: task.guid,
        });
    }

    private startBuildingInterval(building: Building, settler: Settler): void {
        // if (building.status !== 'paused') {
        //     const time = EfficiencyBusiness.calculateEfficiency(
        //         500,
        //         Skill.Building,
        //         settler
        //     );
        //     building.timeMs = time;
        // }
        const time = EfficiencyBusiness.calculateEfficiency(
            1000,
            Skill.Building,
            settler,
            true
        );
        // console.log(EfficiencyBusiness.Building(settler));
        building.buildStorageInterval = setInterval(() => {
            building.timeMs -= time;
            building.percent = this.calculatePercent(building);
            if (building.timeMs <= 0) this.done(building.id);
        }, 1000);
    }

    /*
        35000 = 100%
        1000 = x
        35000x = 100 * 1000
        (100 * 1000) / 35000 = x
    */

    private useMaterialInInventory(
        building: Building,
        item: Itens,
        amount: number,
        taskId?: string
    ): void {
        const index = building.inventory.findIndex(
            (e) => e.type === item && (taskId ? e.taskId === taskId : true)
        );
        building.inventory[index].amount -= amount;
        if (building.inventory[index].amount <= 0) {
            building.inventory.splice(index, 1);
        }
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

    inventoryHasNecessaryMaterials(building: Building): boolean {
        let hasItem = true;
        for (const resource of building.resources) {
            const itemInInventory = building.inventory.find(
                (e) => e.type === resource.id
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

    resume(id: string, settler: Settler): void {
        this.build(id, settler);
    }

    stop(id: string): void {
        const building = this.getBuildingById(id) as Building;
        clearInterval(building.getItemFromStorageInterval);
        if (building.status !== 'done') this.changeStatus(id, 'paused');
    }

    done(id: string): void {
        const building = this.getBuildingById(id) as Building;
        building.timeMs = 0;
        building.percent = 100;
        this.onDoneBuilding.emit({
            id,
            idSettler: building.assignedTo!,
        });
        clearInterval(building.buildStorageInterval);
        this.changeStatus(id, 'done');
        this.unassignSettler(id);
        building.clearWarning();
        building.resources.forEach((e) => {
            this.useMaterialInInventory(building, e.id, e.amount);
        });
        this.notificationService.buildingSuccess({
            title: BuildingDatabase.getBuildingById(building.type).name,
        });
    }

    changeStatus(id: string, status: BuildingStatus): void {
        const building = this.getBuildingById(id) as Building;
        building.status = status;
        this.onChangeStatus.emit({ id, status: building.status });
    }

    private calculatePercent(building: Building): number {
        const fullTime = BuildingDatabase.getBuildingById(building.type).timeMs;
        return Number((100 - (100 * building.timeMs) / fullTime).toFixed(2));
    }

    unassignSettler(idContruction: string): void {
        const building = this.getBuildingById(idContruction) as Building;
        building.assignedTo = null;
        if (building.status === 'building') this.stop(idContruction);
        clearInterval(building.buildStorageInterval);
    }

    unassignSettlerAtDoneBuilding(
        idContruction: string,
        task: Tasks,
        uniqueIdTask: string
    ): void {
        const building = this.getBuildingById(idContruction) as Building;
        building.assignedTo = null;
        const taskBuilding = this.getTaskByBuilding(
            building,
            task,
            uniqueIdTask
        );
        taskBuilding.assignedTo = null;
        clearInterval(taskBuilding.startTaskInterval);
        taskBuilding.timeLeft = 0;
    }

    work(data: {
        settler: Settler;
        idBuilding: string;
        task: Tasks;
        uniqueIdTask: string;
        canStartTask: (task: Task) => boolean;
    }): void {
        const building = this.getBuildingById(data.idBuilding) as Building;
        const task = this.getTaskByBuilding(
            building,
            data.task,
            data.uniqueIdTask
        );
        task.assignedTo = data.settler.id;
        const timeWithEfficienty = EfficiencyBusiness.calculateEfficiency(
            task.baseTimeMs,
            task.mainSkill,
            data.settler
        );
        task.timeLeft = timeWithEfficienty;
        if (!this.inventoryHasNecessaryMaterialsForTask(building, task)) {
            this.startGetItemFromStorageForTask(
                building,
                task,
                timeWithEfficienty,
                data.canStartTask
            );
        } else {
            this.startTask(
                task,
                timeWithEfficienty,
                data.canStartTask,
                building
            );
        }
    }

    private startTask(
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
                    this.useMaterialInInventory(
                        building,
                        e.id,
                        e.amount,
                        task.guid
                    );
                });
            }
            this.onWorkAtStructure.emit(task);
            if (task.requirements) {
                if (!canStart(task)) {
                    clearInterval(task.startTaskInterval);
                    if (
                        !this.inventoryHasNecessaryMaterialsForTask(
                            building,
                            task
                        ) &&
                        !task.warnings?.length
                    ) {
                        this.startGetItemFromStorageForTask(
                            building,
                            task,
                            timeWithEfficienty,
                            canStart
                        );
                    }
                }
            }
        }, 1000);
    }

    // private getTimeWithEfficiencyOfTask(task: Task, settler: Settler): number {
    //     const efficiency = task.efficiencyFn(settler);
    //     const efficiencyCalculated = (task.baseTimeMs * efficiency) / 100;
    //     return efficiency > EfficiencyBusiness.defaultEfficiency
    //         ? efficiencyCalculated - task.baseTimeMs
    //         : task.baseTimeMs - efficiencyCalculated + task.baseTimeMs;
    // }

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

    addTask(idBuilding: string, tasks: Tasks): void {
        const building = this.getBuildingById(idBuilding);
        const task = TaskDatabase.getTaskById(tasks);
        building?.tasks.push(new Task(task));
    }
}
