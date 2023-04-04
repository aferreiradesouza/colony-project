import { BaseBusiness } from 'src/app/shared/business/base.business';
import {
    TaskConsumption,
    TaskResourceGenerated,
    TaskWarning,
} from 'src/app/shared/database/task.database';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';
import { HelperService } from 'src/app/shared/services/helpers.service';

export class Task {
    public id: Tasks;
    public guid: string;
    public name: string;
    public assignedTo: string | null;
    public baseTimeMs: number;
    public available: boolean;
    public consumption: TaskConsumption[];
    public resourceGenerated: TaskResourceGenerated[];
    public requirements?: (
        baseBusiness: BaseBusiness,
        task: Task
    ) => TaskWarning;
    public warnings: TaskWarning = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public interval: any = null;

    constructor(data: {
        id: Tasks;
        guid?: string;
        assignedTo: string | null;
        baseTimeMs: number;
        name: string;
        available: boolean;
        consumption: TaskConsumption[];
        resourceGenerated: TaskResourceGenerated[];
        requirements?: (baseBusiness: BaseBusiness, task: Task) => TaskWarning;
    }) {
        this.id = data.id;
        this.name = data.name;
        this.guid = data.guid ?? HelperService.guid;
        this.assignedTo = data.assignedTo;
        this.baseTimeMs = data.baseTimeMs;
        this.available = data.available;
        this.consumption = data.consumption;
        this.requirements = data.requirements;
        this.resourceGenerated = data.resourceGenerated;
    }
}
