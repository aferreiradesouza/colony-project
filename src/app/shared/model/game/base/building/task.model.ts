import { BaseBusiness } from 'src/app/shared/business/base.business';
import {
    TaskConsumption,
    TaskResourceGenerated,
    RequerimentsWarning,
    ITaskDatabase,
    TaskDatabase,
    TaskProcessQueue,
} from 'src/app/shared/database/task.database';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';
import { HelperService } from 'src/app/shared/services/helpers.service';
import { Settler } from '../settler/settler.model';
import { Skill } from '../settler/skill.model';
import { Items } from 'src/app/shared/interface/enums/item.enum';
import { ProcessTask } from 'src/app/shared/interface/enums/process-task.enum';

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
    public requirements?: (
        baseBusiness: BaseBusiness,
        task: Task
    ) => RequerimentsWarning;
    public warnings: RequerimentsWarning = [];
    public currentProcess?: ProcessTask;
    public processQueue: TaskProcessQueue[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public startTaskInterval: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getItemFromStorageInterval: any = null;

    constructor(data: {
        id: Tasks;
        guid?: string;
        assignedTo: string | null;
        baseTimeMs: number;
        name: string;
        mainSkill: Skill;
        available: boolean;
        consumption: TaskConsumption[];
        resourceGenerated: TaskResourceGenerated[];
        currentProcess?: ProcessTask;
        efficiencyFn: (settler: Settler) => number;
        requirements?: (
            baseBusiness: BaseBusiness,
            task: Task
        ) => RequerimentsWarning;
    }) {
        const task = this._getDatabase(data.id);
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
        this.currentProcess = data.currentProcess;
        this.processQueue = task.processQueue;
    }

    private _getDatabase(id: Tasks): ITaskDatabase {
        return TaskDatabase.getTaskById(id);
    }

    addWarning(errors: RequerimentsWarning): void {
        this.warnings = errors ?? [];
    }

    clearWarning(): void {
        this.warnings = [];
    }

    getTaskConsumption(id: Items): TaskConsumption | null {
        return this.consumption.find((e) => e.id === id) ?? null;
    }

    get hasWorkInProgress(): boolean {
        return !!this.assignedTo;
    }

    get currentProcessData(): TaskProcessQueue | undefined {
        return this.processQueue.find((e) => e.id === this.currentProcess);
    }
}
