import { Injectable } from '@angular/core';
import { BuildingDatabase } from '../database/building.database';
import { Tasks } from '../interface/enums/tasks.enum';
import {
    Building,
    BuildingStatus,
} from '../model/game/base/building/building.model';
import { NotificationService } from '../services/notification.service';
import { Items } from '../interface/enums/item.enum';
import { Settler } from '../model/game/base/settler/settler.model';
import { EfficiencyBusiness } from './efficiency.business';
import { Item } from '../model/game/base/building/storage/item.model';
import { HelperService } from '../services/helpers.service';
import { Skill } from '../model/game/base/settler/skill.model';
import { Business } from './business';
import { Task } from '../model/game/base/building/task.model';

@Injectable({ providedIn: 'root' })
export class BuildingBusiness extends Business {
    constructor(private notificationService: NotificationService) {
        super();
    }

    get buildings(): Building[] {
        const buildings = [...Business.gameBusiness.game.base.buildings];
        if (Business.gameBusiness.game.base.storage)
            buildings.push(Business.gameBusiness.game.base.storage);
        return buildings;
    }

    add(data: Building): void {
        Business.gameBusiness.game.base.buildings.push(data);
    }

    setBuilding(building: Building[]): void {
        Business.gameBusiness.game.base.buildings = building;
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

    addItemInInventory(data: {
        id: string;
        item: Item;
        taskId?: string;
    }): void {
        const building = this.getBuildingById(data.id) as Building;
        const ItemOfStorage = this.getItemByType(
            data.item.type,
            building,
            data.taskId
        );
        if (ItemOfStorage) {
            ItemOfStorage.amount += data.item.amount;
        } else {
            building.inventory.push({
                ...data.item,
                id: HelperService.guid,
                taskId: data.taskId,
            } as Item);
        }
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
        Business.baseBusiness.getMaterial({
            amount: 10,
            building,
            id: itemToPickup.type,
        });
    }

    private startBuildingInterval(building: Building, settler: Settler): void {
        building.build(settler, (buildingFinished) =>
            this.done(buildingFinished.id)
        );
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
        Business.baseBusiness.doneBuilding({
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
        // this.onChangeStatus.emit({ id, status: building.status });
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
        const taskBuilding = Business.taskBusiness.getTaskByBuilding(
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
    }): void {
        const building = this.getBuildingById(data.idBuilding) as Building;
        const task = Business.taskBusiness.getTaskByBuilding(
            building,
            data.task,
            data.uniqueIdTask
        );
        task.assignedTo = data.settler.id;
        // const timeWithEfficienty = EfficiencyBusiness.calculateEfficiency(
        //     task.baseTimeMs,
        //     task.mainSkill,
        //     data.settler
        // );
        // task.timeLeft = timeWithEfficienty;
        Business.taskBusiness.startTask(task, building, data.settler);
    }

    generateResource(task: Task, building: Building): void {
        task.resourceGenerated.forEach((e) => {
            this.addItemInInventory({
                id: building.id,
                item: new Item({
                    amount: e.amount,
                    id: HelperService.guid,
                    type: e.id,
                }),
                taskId: task.guid,
            });
        });
    }
}
