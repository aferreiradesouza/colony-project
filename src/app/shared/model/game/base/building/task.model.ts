import {
    TaskConsumption,
    TaskResourceGenerated,
    RequirimentsWarning,
    ITaskDatabase,
    TaskDatabase,
    ProcessQueue,
    Warning,
} from 'src/app/shared/database/task.database';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';
import { HelperService } from 'src/app/shared/services/helpers.service';
import { Settler } from '../settler/settler.model';
import { Items } from 'src/app/shared/interface/enums/item.enum';
import { Process } from 'src/app/shared/interface/enums/process.enum';
import { Skill } from 'src/app/shared/interface/enums/skill.enum';
import { LogService } from 'src/app/shared/services/log.service';

interface TaskData {
    id: Tasks;
    guid?: string;
    assignedTo: string | null;
    baseTimeMs: number;
    name: string;
    mainSkill: Skill;
    available: boolean;
    consumption: TaskConsumption[];
    resourceGenerated: TaskResourceGenerated[];
    currentProcess?: Process;
    efficiencyFn: (settler: Settler) => number;
}

export class Task {
    public id: Tasks;
    public guid: string;
    public name: string;
    public assignedTo: string | null;
    public baseTimeMs: number;
    public available: boolean;
    public mainSkill: Skill;
    public consumption: TaskConsumption[];
    public timeLeft: number;
    public resourceGenerated: TaskResourceGenerated[];
    public efficiencyFn: (settler: Settler) => number;
    public requirements?: ((task: Task) => RequirimentsWarning)[];
    public warnings: Warning[] = [];
    public currentProcess: Process = Process.None;
    public processQueue: ProcessQueue[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public startTaskInterval: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getItemFromStorageInterval: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getItemFromTaskInterval: any = null;

    constructor(data: TaskData) {
        const task = this.getDatabase(data.id);
        this.id = data.id;
        this.name = data.name;
        this.guid = data.guid ?? HelperService.guid;
        this.assignedTo = data.assignedTo;
        this.baseTimeMs = task.baseTimeMs;
        this.mainSkill = task.mainSkill;
        this.timeLeft = 0;
        this.available = data.available;
        this.consumption = task.consumption;
        this.requirements = task.requirements;
        this.efficiencyFn = task.efficiencyFn;
        this.resourceGenerated = task.resourceGenerated;
        this.currentProcess = data.currentProcess ?? Process.None;
        this.processQueue = task.processQueue ?? [];
    }

    private getDatabase(id: Tasks): ITaskDatabase {
        return TaskDatabase.getTaskById(id);
    }

    addWarning(errors: RequirimentsWarning): void {
        if (errors) {
            // this.warnings = errors;
        }
    }

    /**
     * Clears all warnings associated with the task.
     * This method resets the warnings array to an empty state.
     */
    clearWarning(): void {
        this.warnings = [];
    }

    /**
     * Retrieves the task consumption for a given item ID.
     *
     * @param id - The ID of the item to find the task consumption for.
     * @returns The task consumption associated with the given item ID, or null if not found.
     */
    getTaskConsumption(id: Items): TaskConsumption | null {
        return this.consumption.find((e) => e.id === id) ?? null;
    }

    /**
     * Checks if there is any work currently in progress.
     * 
     * @returns {boolean} `true` if there is an assigned task, otherwise `false`.
     */
    get hasWorkInProgress(): boolean {
        return !!this.assignedTo;
    }

    /**
     * Retrieves the current process data from the process queue.
     *
     * @returns {ProcessQueue | undefined} The current process data if found, otherwise undefined.
     */
    get currentProcessData(): ProcessQueue | undefined {
        return this.processQueue.find((e) => e.id === this.currentProcess);
    }

    /**
     * Changes the current process to the specified new process if it exists in the process queue.
     * 
     * @param newProcess - The new process to set as the current process.
     * @throws Will log an error if the new process is not found in the process queue.
     */
    changeCurrentProcess(newProcess: Process): void {
        if (this.processQueue.some((e) => e.id === newProcess)) {
            this.currentProcess = newProcess;
        } else {
            LogService.add(`Invalid process: ${newProcess}`);
        }
    }
}
