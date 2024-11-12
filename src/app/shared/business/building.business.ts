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
import { Business } from './business';
import { Task } from '../model/game/base/building/task.model';
import { Skill } from '../interface/enums/skill.enum';
import { Process } from '../interface/enums/process.enum';
import { MAX_KG } from '../constants/settlers.constant';
import { ItemDatabase } from '../database/item.database';
import { LogService } from '../services/log.service';

@Injectable({ providedIn: 'root' })
export class BuildingBusiness extends Business {
    constructor(private notificationService: NotificationService) {
        super();
    }

    /**
     * Retrieves the list of buildings in the game base.
     * If the base has a storage building, it is included in the list.
     *
     * @returns {Building[]} An array of buildings in the game base.
     */
    get buildings(): Building[] {
        const buildings = [...Business.gameBusiness.game.base.buildings];
        if (Business.gameBusiness.game.base.storage)
            buildings.push(Business.gameBusiness.game.base.storage);
        return buildings;
    }

    /**
     * Adds a new building to the game's base buildings.
     *
     * @param data - The building data to be added.
     */
    add(data: Building): void {
        Business.gameBusiness.game.base.buildings.push(data);
    }

    /**
     * Retrieves a building by its unique identifier.
     *
     * @param id - The unique identifier of the building.
     * @returns The building with the specified id, or null if no building is found.
     */
    getBuildingById(id: string): Building | null {
        return this.buildings.find((e) => e.id === id) ?? null;
    }

    /**
     * Retrieves a building assigned to a specific settler by their ID.
     *
     * @param id - The ID of the settler.
     * @returns The building assigned to the settler, or null if no building is found.
     */
    getBuildingBySettler(id: string): Building | null {
        return this.buildings.find((e) => e.assignedTo === id) ?? null;
    }

    /**
     * Assigns a settler to a building.
     *
     * @param settler - The settler to be assigned.
     * @param building - The building to which the settler will be assigned.
     */
    assignSettlerBuilding(settler: Settler, building: Building): void {
        building.assignSettler(settler);
    }

    /**
     * Initiates the building process for a given building by a settler.
     * 
     * This method first checks if the building is valid. If the building is not valid, 
     * the method returns immediately. If the building is valid, it then checks if the 
     * necessary materials are available in the inventory. If the materials are not available, 
     * it starts the process of retrieving the items from storage. If the materials are available, 
     * it starts the building interval process.
     * 
     * Finally, it changes the status of the building to 'building'.
     * 
     * @param building - The building object that needs to be built.
     * @param settler - The settler who will perform the building process.
     * 
     * @returns void
     */
    build(building: Building, settler: Settler): void {
        if(!building.isValid) return;
        this.startProcess(building, settler);
        this.changeStatus(building, 'building');
    }

    /**
     * Checks if the building's inventory contains the necessary materials.
     *
     * This method iterates through the required resources for the building and checks if
     * the inventory has the required amount of each resource.
     *
     * @param building - The building object whose inventory is to be checked.
     * @returns {boolean} True if the inventory has all necessary materials, false otherwise.
     */
    private inventoryHasNecessaryMaterials(building: Building): boolean {
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
    
    /**
     * Initiates the process of retrieving items from storage for a building.
     * If the necessary materials are already in the inventory, it starts the building interval.
     * Otherwise, it sets an interval to periodically check and retrieve the required items.
     *
     * @param building - The building for which items are being retrieved.
     * @param settler - The settler who is performing the action.
     * @private
     */
    private startGetItemFromStorage(building: Building,settler: Settler): void {
        if (this.inventoryHasNecessaryMaterials(building)) {
            this.startBuildingInterval(building, settler);
            return;
        }
        const time = EfficiencyBusiness.calculateEfficiency(
            1000,
            Skill.Agility,
            settler
        );
        this.startOrderFromStorage(building, settler, time);
    }

    /**
     * Initiates an order to retrieve materials from storage for a building process.
     * 
     * This method creates a promise to handle the order of retrieving materials from storage.
     * If the necessary materials are available in the inventory, it changes the building's
     * current process to "Construir" and starts the step process. If the materials are not
     * available, it recursively calls itself to retry the order.
     * 
     * @param building - The building for which the materials are being retrieved.
     * @param settler - The settler who is responsible for retrieving the materials.
     * @param time - The time allocated for the order.
     */
    private startOrderFromStorage(building: Building, settler: Settler, time: number): void {
        let onResolveOrder: (() => void) | undefined = undefined;
        let onRejectOrder: (() => void) | undefined = undefined;
        const promiseOfOrder = new Promise((resolve, reject) => {
            onResolveOrder = resolve as (() => void);
            onRejectOrder = reject as (() => void);
        });
        this.createOrder(building, settler, time, onResolveOrder, onRejectOrder);
        promiseOfOrder.then(() => {
            if (this.inventoryHasNecessaryMaterials(building)) {
                building.changeCurrentProcess(Process.Construir);
                this.startStepProcess(building, settler);
            } else {
                if (building.status !== 'stopped' && building.status !== 'done' && building.status !== 'paused') {
                    this.startOrderFromStorage(building, settler, time);
                }
            }
        }).catch(() => {
            LogService.add(`Error getting item from storage for building ${building.id} and settler ${settler.id}`);
        });
    }

    /**
     * Creates an order for a settler to interact with a building after a specified time delay.
     *
     * @param building - The building with which the settler will interact.
     * @param settler - The settler who will perform the interaction.
     * @param time - The delay in milliseconds before the interaction occurs.
     * @param resolveOrder - An optional callback function to be called if the order is successfully resolved.
     * @param rejectOrder - An optional callback function to be called if the order is rejected or fails.
     */
    private createOrder(building: Building, settler: Settler, time: number, resolveOrder: (() => void) | undefined, rejectOrder: (() => void) | undefined): void {
        setTimeout(() => {
            this.whichItemWillPickUp(building, settler, resolveOrder, rejectOrder );
        }, time);
    }

    /**
     * Initiates the building process for a given building and settler.
     * 
     * @param building - The building that is to be constructed.
     * @param settler - The settler who will be constructing the building.
     * 
     * This method calls the `build` method on the building object, passing the settler and a callback function.
     * The callback function is executed when the building is finished, and it calls the `done` method with the building's ID.
     */
    private startBuildingInterval(building: Building, settler: Settler): void {
        building.build(settler, (buildingFinished) =>
            this.done(buildingFinished)
        );
    }

    /**
     * Changes the status of a building identified by the given ID.
     *
     * @param id - The unique identifier of the building.
     * @param status - The new status to be assigned to the building.
     * @returns void
     */
    changeStatus(building: Building, status: BuildingStatus): void {
        building.updateStatus(status);
    }

    /**
     * Marks the building process as done by setting the time to 0 and the completion percentage to 100.
     * Changes the building status to 'done', unassigns any settlers from the building, clears any warnings,
     * and uses the required materials from the inventory. Finally, it sends a success notification.
     *
     * @param {Building} building - The building object to be marked as done.
     * @returns {void}
     */
    done(building: Building): void {
        building.currentProcess = Process.None;
        building.timeMs = 0;
        building.percent = 100;
        this.changeStatus(building, 'done');
        this.unassignSettlerToBuilding(building);
        building.clearWarning();
        building.resources.forEach((e) => {
            building.useMaterialInInventory(e.id, e.amount);
        });
        this.notificationService.buildingSuccess({
            title: BuildingDatabase.getBuildingById(building.type).name,
        });
    }

    /**
     * Unassigns a settler from the given building.
     * 
     * If the building has a settler assigned, it will unassign the settler from their work.
     * Then, it sets the building's assigned settler to null.
     * If the building's status is 'building', it stops the building process.
     * Finally, it clears the building's build interval.
     * 
     * @param building - The building from which to unassign the settler.
     */
    unassignSettlerToBuilding(building: Building): void {
        if(building.assignedTo) {
            Business.settlersBusiness.unassignWork(building.assignedTo);
        }
        building.assignedTo = null;
        if (building.status === 'building') this.stop(building);
        clearInterval(building.buildInterval);
    }

    /**
     * Stops the specified building's interval and updates its status to 'stopped' if it is not already 'done'.
     *
     * @param {Building} building - The building instance to stop.
     * @returns {void}
     */
    stop(building: Building): void {
        if (building.status !== 'done') this.changeStatus(building, 'stopped');
    }

    /**
     * Pauses the construction of a building if its status is not 'done'.
     *
     * @param {Building} building - The building object whose construction is to be paused.
     */
    pause(building: Building): void {
        if(building.assignedTo) {
            Business.settlersBusiness.unassignWork(building.assignedTo);
        }
        building.assignedTo = null;
        if (building.status !== 'done') this.changeStatus(building, 'paused');
        clearInterval(building.buildInterval);
    }

    /**
     * Resumes the construction of a building if it is not already completed.
     *
     * @param building - The building object whose construction status needs to be resumed.
     */
    resume(building: Building): void {
        if (building.status !== 'done') this.changeStatus(building, 'building');
    }
    
    /**
     * Determines which item a settler will pick up from a building and initiates the pickup process.
     *
     * @param building - The building from which the item will be picked up.
     * @param settler - The settler who will pick up the item.
     * @returns void
     */
    private whichItemWillPickUp(building: Building, settler: Settler, resolveOrder: (() => void) | undefined, rejectOrder: (() => void) | undefined): void {
        const itemToPickup = this.findItemToPickup(building, settler);
        if (!itemToPickup) return;
        this.pickupItem(building, itemToPickup, settler, resolveOrder, rejectOrder);
    }

    /**
     * Finds an item that a settler needs to pick up for a building.
     *
     * @param building - The building for which the item is needed.
     * @param settler - The settler who will pick up the item.
     * @returns An object containing the type and amount of the item to pick up, or null if no item is needed.
     */
    private findItemToPickup(building: Building, settler: Settler): { type: Items; amount: number } | null {
        for (const resourceNecessary of building.resources) {
            const hasItem = this.hasSufficientItem(building, resourceNecessary.id, resourceNecessary.amount);
            if (!hasItem) {
                return this.calculateItemToPickup(building, resourceNecessary.id, resourceNecessary.amount, settler);
            }
        }
        return null;
    }

    /**
     * Checks if the building has a sufficient amount of a specific item in its inventory.
     *
     * @param building - The building whose inventory is being checked.
     * @param itemId - The ID of the item to check for.
     * @param requiredAmount - The required amount of the item.
     * @returns `true` if the building has at least the required amount of the item, otherwise `false`.
     */
    private hasSufficientItem(building: Building, itemId: Items, requiredAmount: number): boolean {
        const item = building.inventory.find((e) => e.type === itemId && e.amount >= requiredAmount);
        return !!item;
    }
    
    /**
     * Calculates the amount of a specific item that a settler can pick up from a building's inventory.
     *
     * @param building - The building from which the item is to be picked up.
     * @param itemId - The ID of the item to be picked up.
     * @param requiredAmount - The required amount of the item.
     * @param settler - The settler who will pick up the item.
     * @returns An object containing the type of item and the amount that can be picked up.
     */
    private calculateItemToPickup(building: Building, itemId: Items, requiredAmount: number, settler: Settler): { type: Items; amount: number } {
        const itemInInventory = building.inventory.find((e) => e.type === itemId && e.amount <= requiredAmount);
        const maxKg = EfficiencyBusiness.calculateEfficiency(
            MAX_KG,
            Skill.Strong,
            settler,
            false
        );
        const itemDefinitions = ItemDatabase.getItemById(itemId);
        const availableTransportCapacity = Math.floor(maxKg / itemDefinitions.weight);
        if (!itemInInventory) {
            return { type: itemId, amount: availableTransportCapacity };
        } else {
            return {
                type: itemInInventory.type,
                amount: itemInInventory.amount + availableTransportCapacity > requiredAmount
                    ? requiredAmount - itemInInventory.amount
                    : availableTransportCapacity,
            };
        }
    }

    /**
     * Handles the process of picking up an item from a building by a settler.
     * Creates an order for the settler to pick up the specified item from the building.
     *
     * @param building - The building from which the item is to be picked up.
     * @param itemToPickup - An object containing the type and amount of the item to be picked up.
     * @param settler - The settler who will pick up the item.
     * @param resolveOrder - A callback function to be called if the order is successfully completed.
     * @param rejectOrder - A callback function to be called if the order fails.
     */
    private pickupItem(building: Building, itemToPickup: { type: Items; amount: number }, settler: Settler, resolveOrder: (() => void) | undefined, rejectOrder: (() => void) | undefined): void {
        Business.storageBusiness.createOrder(settler, {
            amount: itemToPickup.amount,
            building,
            item: itemToPickup.type,
            onDone: (success: boolean) => {
                if (success) {
                    if (resolveOrder) resolveOrder();
                } else {
                    if (rejectOrder) rejectOrder();
                }
            }
        });
    }

    /**
     * Initiates the step process for a given building and settler based on the current process of the building.
     *
     * @param building - The building for which the process is being started.
     * @param settler - The settler who will perform the process.
     */
    startStepProcess(building: Building, settler: Settler): void {
        switch (building.currentProcess) {
            case Process.TransportarDoDeposito:
                this.startGetItemFromStorage(building, settler);
                break;

            case Process.Construir:
                this.startBuildingInterval(building, settler);
                break;

            default:
                console.log('default');
                break;
        }
    }

    /**
     * Initiates the process for a given building and settler.
     * 
     * This method changes the current process of the building to the first process in the queue
     * and then starts the step process for the building and settler.
     * 
     * @param building - The building for which the process is to be started.
     * @param settler - The settler who will be involved in the process.
     * @returns void
     */
    startProcess(building: Building, settler: Settler): void {
        building.changeCurrentProcess(building.currentProcess || building.processQueue[0].id);
        this.startStepProcess(building, settler);
    }

    // ============================ // ============================ // ============================

    unassignSettlerAtDoneBuilding(
        building: Building,
        task: Tasks,
        uniqueIdTask: string
    ): void {
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

    /**
     * Generates resources for a given task and adds them to the building's inventory.
     *
     * @param task - The task for which resources are being generated.
     * @param building - The building where the resources will be added.
     */
    generateResource(task: Task, building: Building): void {
        task.resourceGenerated.forEach((e) => {
            building.addItemInInventory({
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
