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
import { Items } from '../interface/enums/item.enum';
import { Settler } from '../model/game/base/settler/settler.model';
import { EfficiencyBusiness } from './efficiency.business';
import { Item } from '../model/game/base/building/storage/item.model';
import { HelperService } from '../services/helpers.service';
import { Skill } from '../model/game/base/settler/skill.model';
import { TaskBusiness } from './task.business';

@Injectable({ providedIn: 'root' })
export class BuildingBusiness {
    public taskBusiness!: TaskBusiness;

    public onDoneBuilding = new EventEmitter<{
        id: string;
        idSettler: string;
    }>();
    public onChangeStatus = new EventEmitter<{
        id: string;
        status: BuildingStatus;
    }>();
    public onWorkAtStructure = new EventEmitter<Task>();
    public onUseMaterial = new EventEmitter<{ id: Items; amount: number }[]>();
    public onGetMaterial = new EventEmitter<{
        id: Items;
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
            } as Item);
    }

    private getItemByType(
        type: Items,
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

    private whichItemWillPickUp(building: Building): void {
        let itemToPickup:
            | {
                  type: Items;
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

    private startBuildingInterval(building: Building, settler: Settler): void {
        const time = EfficiencyBusiness.calculateEfficiency(
            1000,
            Skill.Building,
            settler,
            true
        );
        building.buildStorageInterval = setInterval(() => {
            building.timeMs -= time;
            building.percent = this.calculatePercent(building);
            if (building.timeMs <= 0) this.done(building.id);
        }, 1000);
    }

    public useMaterialInInventory(
        building: Building,
        item: Items,
        amount: number,
        taskId?: string
    ): void {
        const index = building.inventory.findIndex(
            (e) => e.type === item && (taskId ? e.taskId === taskId : true)
        );
        if (index === -1) return;
        building.inventory[index].amount -= amount;
        if (building.inventory[index].amount <= 0) {
            building.inventory.splice(index, 1);
        }
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
        const taskBuilding = this.taskBusiness.getTaskByBuilding(
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
        const task = this.taskBusiness.getTaskByBuilding(
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
        if (
            !this.taskBusiness.inventoryHasNecessaryMaterialsForTask(
                building,
                task
            )
        ) {
            this.taskBusiness.startGetItemFromStorageForTask(
                building,
                task,
                timeWithEfficienty,
                data.canStartTask
            );
        } else {
            this.taskBusiness.startTask(
                task,
                timeWithEfficienty,
                data.canStartTask,
                building
            );
        }
    }
}
