import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Job } from 'src/app/shared/interface/enums/job.enum';
import {
    BuildingDatabase,
    IBuildingDatabase,
} from '../../../../database/building.database';
import { HelperService } from '../../../../services/helpers.service';
import { Task } from './task.model';
import { Items } from 'src/app/shared/interface/enums/item.enum';
import { RequirimentsWarning, ProcessQueue, Warning } from 'src/app/shared/database/task.database';
import { Item } from './storage/item.model';
import { Biomes } from 'src/app/shared/interface/enums/biomes.enum';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';
import { Settler } from '../settler/settler.model';
import { EfficiencyBusiness } from 'src/app/shared/business/efficiency.business';
import { EventEmitter } from '@angular/core';
import { Skill } from 'src/app/shared/interface/enums/skill.enum';
import { Process } from 'src/app/shared/interface/enums/process.enum';

export type BuildingStatus = 'not-started' | 'building' | 'paused' | 'stopped' | 'done';
export type BuildingResource = { id: Items; amount: number };

export interface BuildingData {
    id?: string;
    type: Buildings;
    status?: BuildingStatus;
    inventory?: Item[];
    assignedTo?: string | null;
    timeMs?: number;
    tasks?: Task[];
    biome: Biomes;
    currentProcess?: Process;
}

export class Building {
    public id: string;
    public type: Buildings;
    public status: BuildingStatus;
    public jobNecessary: Job | null;
    public tasksAllowed?: Tasks[];
    public jobToCreateStructure: Job;
    public timeMs: number;
    public assignedTo: string | null = null;
    public percent = 0;
    public biome: Biomes;
    public tasks: Task[] = [];
    public inventory: Array<Item>;
    public warnings: Warning[] = [];
    public resources: BuildingResource[] = [];
    public currentProcess?: Process;
    public processQueue: ProcessQueue[] = [];
    public requirements?: ((
        building: Building
    ) => RequirimentsWarning)[] = [];
    private errors: RequirimentsWarning = null;

    public buildingDone = new EventEmitter<Building>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getItemFromStorageTimeout: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public buildInterval: any = null;

    constructor(building: BuildingData) {
        const structure = this.getDatabase(building.type);
        this.biome = building.biome;
        this.type = building.type;
        this.inventory = building.inventory ?? [];
        this.status =
            building?.status === 'building'
                ? 'paused'
                : building.status ?? 'not-started';
        this.id = building.id ?? HelperService.guid;
        this.tasksAllowed = structure.tasksAllowed;
        this.jobNecessary = structure.jobNecessary;
        this.jobToCreateStructure = structure.jobToCreateStructure;
        this.timeMs = building.timeMs ?? structure.timeMs;
        this.resources = structure.resources ?? [];
        this.requirements = structure.requirements;
        this.processQueue = structure.processQueue;
        this.currentProcess = building.currentProcess ?? Process.None;
        this.tasks =
            building.tasks?.map(
                (e) =>
                    new Task({
                        ...e,
                        consumption: e.consumption ?? [],
                        assignedTo: null
                    })
            ) ?? [];
    }

    /**
     * Retrieves the building database entry for the specified building ID.
     *
     * @param id - The ID of the building to retrieve from the database.
     * @returns The database entry corresponding to the specified building ID.
     */
    private getDatabase(id: Buildings): IBuildingDatabase {
        return BuildingDatabase.getBuildingById(id);
    }

    public get hasRequirements(): boolean {
        return !!(this.requirements && this.requirements.length > 0);
    }

    /**
     * Adds a warning to the building model.
     * 
     * @param errors - The warning to be added, represented by a `RequirimentsWarning` object.
     */
    public addWarning(errors: RequirimentsWarning): void {
        this.warnings = this.warningsToArray(errors);
    }

    /**
     * Converts a `RequirimentsWarning` object to an array of `Warning` objects.
     * Each entry in the `RequirimentsWarning` object is transformed into a `Warning` object
     * with `id` and `message` properties.
     *
     * @param errors - The `RequirimentsWarning` object containing warning messages.
     * @returns An array of `Warning` objects. If the input is null or undefined, returns an empty array.
     */
    private warningsToArray(errors: RequirimentsWarning): Warning[] {
        if (!errors) return [];
        return Object.entries(errors).map(([id, message]) => ({
            id: parseInt(id),
            message,
        }));
    }

    /**
     * Clears all warnings associated with the building.
     * This method resets the warnings array to an empty state.
     */
    public clearWarning(): void {
        this.warnings = [];
    }

    /**
     * Calculates the percentage of time remaining for the building process.
     *
     * @returns {number} The percentage of time remaining, rounded to two decimal places.
     */
    public calculatePercent(): number {
        const fullTime = BuildingDatabase.getBuildingById(this.type).timeMs;
        return Number((100 - (100 * this.timeMs) / fullTime).toFixed(2));
    }

    /**
     * Checks if the building meets its requirements.
     *
     * @returns {boolean} - Returns `true` if there are no requirements or if all requirements are met, otherwise returns `false`.
     */
    get isValid(): boolean {
        return !this.errors;
    }

    /**
     * Executes the validation functions defined in the `requirements` array.
     * If there are no requirements or the requirements array is empty, it adds a warning with `null`.
     * Otherwise, it iterates through each validation function, collects any errors, and adds them as warnings.
     *
     * @remarks
     * - The `requirements` property is expected to be an array of functions that take the current instance as an argument and return an error object if validation fails.
     * - The `addWarning` method is called with the collected errors or `null` if no requirements are present.
     */
    executeValidations(): void {
        if(!this.requirements || (this.requirements && !this.requirements?.length)) {
            this.addWarning(null);
            return;
        }
        let errors: RequirimentsWarning = null;
        this.requirements.forEach(fn => {
            const currentError = fn(this);
            if (currentError) {
                errors = {
                    ...(errors ?? {}),
                    ...currentError,
                };
            }
        });
        this.errors = errors;
        if (errors) {
            this.addWarning(errors);
        } else {
            this.clearWarning();
        }
    }

    /**
     * Assigns a settler to the building.
     *
     * @param settler - The settler to be assigned.
     */
    assignSettler(settler: Settler): void {
        this.assignedTo = settler.id;
    }

    /**
     * Initiates the building process for the storage.
     * 
     * @param settler - The settler who is building the storage.
     * @param onDone - A callback function that is called when the building process is complete.
     */
    public build(settler: Settler, onDone: (building: Building) => void): void {
        const timeLeft = EfficiencyBusiness.calculateEfficiency(
            1000,
            Skill.Building,
            settler
        );
        const timeUpdate = EfficiencyBusiness.calculateEfficiency(
            1000,
            Skill.Agility,
            settler
        );
        this.buildInterval = setInterval(() => {
            this.timeMs -= timeLeft;
            this.percent = this.calculatePercent();
            if (this.timeMs <= 0) onDone(this);
        }, timeUpdate);
    }
    
    /**
     * Uses a specified amount of material from the inventory.
     * 
     * @param item - The type of item to be used from the inventory.
     * @param amount - The amount of the item to be used.
     * @param taskId - (Optional) The task ID associated with the item.
     * 
     * If the specified item and task ID (if provided) are found in the inventory,
     * the specified amount is deducted from the item's quantity. If the item's
     * quantity becomes zero or less, it is removed from the inventory.
     */
    public useMaterialInInventory(
        item: Items,
        amount: number,
        taskId?: string
    ): void {
        const index = this.inventory.findIndex(
            (e) => e.type === item && (taskId ? e.taskId === taskId : true)
        );
        if (index === -1) return;
        this.inventory[index].amount -= amount;
        if (this.inventory[index].amount <= 0) {
            this.inventory.splice(index, 1);
        }
    }

    /**
     * Updates the status of the building.
     *
     * @param status - The new status to set for the building.
     */
    public updateStatus(status: BuildingStatus): void {
        this.status = status;
    }

    /**
     * Retrieves an item from the inventory based on the specified item type.
     *
     * @param item - The type of item to search for in the inventory.
     * @returns The item from the inventory if found, otherwise `null`.
     */
    public getItemInInventory(item: Items): Item | null {
        return this.inventory.find(e => e.type === item) ?? null;
    }

    /**
     * Changes the current process to the specified process.
     *
     * @param process - The new process to set as the current process.
     */
    public changeCurrentProcess(process: Process): void {
        this.currentProcess = process;
    }

    /**
     * Adds an item to the inventory. If an item of the same type and taskId already exists,
     * it increases the amount of that item. Otherwise, it adds a new item to the inventory.
     *
     * @param data - The data required to add an item to the inventory.
     * @param data.id - The unique identifier for the item.
     * @param data.item - The item to be added to the inventory.
     * @param data.taskId - (Optional) The task identifier associated with the item.
     * 
     * @returns void
     */
    public addItemInInventory(data: {
        id: string;
        item: Item;
        taskId?: string;
    }): void {
        const ItemOfStorage = this.getItemFromInventoryByType(
            data.item.type,
            data.taskId
        );
        if (ItemOfStorage) {
            ItemOfStorage.amount += data.item.amount;
        } else {
            this.inventory.push({
                ...data.item,
                id: HelperService.guid,
                taskId: data.taskId,
            } as Item);
        }
    }

    /**
     * Retrieves an item from the inventory based on its type and an optional task ID.
     *
     * @param type - The type of the item to retrieve.
     * @param taskId - (Optional) The task ID associated with the item.
     * @returns The item if found, otherwise null.
     */
    public getItemFromInventoryByType(
        type: Items,
        taskId?: string
    ): Item | null {
        return (
            this.inventory.find(
                (e) => e.type === type && (taskId ? e.taskId === taskId : true)
            ) ?? null
        );
    }
}
