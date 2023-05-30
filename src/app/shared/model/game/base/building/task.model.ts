import { BaseBusiness } from 'src/app/shared/business/base.business';
import {
    TaskConsumption,
    TaskResourceGenerated,
    RequerimentsWarning,
} from 'src/app/shared/database/task.database';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';
import { HelperService } from 'src/app/shared/services/helpers.service';
import { Settler } from '../settler/settler.model';

export class Task {
    public id: Tasks;
    public guid: string;
    public name: string;
    public assignedTo: string | null;
    public baseTimeMs: number;
    public available: boolean;
    public consumption: TaskConsumption[];
    public timeLeft: number;
    public resourceGenerated: TaskResourceGenerated[];
    public efficiencyFn: (task: Task, settler: Settler) => number;
    public requirements?: (
        baseBusiness: BaseBusiness,
        task: Task
    ) => RequerimentsWarning;
    public warnings: RequerimentsWarning = [];

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
        available: boolean;
        consumption: TaskConsumption[];
        resourceGenerated: TaskResourceGenerated[];
        efficiencyFn: (task: Task, settler: Settler) => number;
        requirements?: (
            baseBusiness: BaseBusiness,
            task: Task
        ) => RequerimentsWarning;
    }) {
        this.id = data.id;
        this.name = data.name;
        this.guid = data.guid ?? HelperService.guid;
        this.assignedTo = data.assignedTo;
        this.baseTimeMs = data.baseTimeMs;
        this.timeLeft = 0;
        this.available = data.available;
        this.consumption = data.consumption;
        this.requirements = data.requirements;
        this.efficiencyFn = data.efficiencyFn;
        this.resourceGenerated = data.resourceGenerated;
    }

    addWarning(errors: RequerimentsWarning): void {
        this.warnings = errors ?? [];
    }

    clearWarning(): void {
        this.warnings = [];
    }
}
