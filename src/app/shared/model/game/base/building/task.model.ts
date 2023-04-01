import { BaseBusiness } from 'src/app/shared/business/base.business';
import { RequerimentsErrors } from 'src/app/shared/interface/enums/requeriments-errors.enum';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';

export class Task {
    public id: Tasks;
    public assignedTo: string | null;
    public baseTimeMs: number;
    public available: boolean;
    public requirements?: (
        baseBusiness: BaseBusiness,
        task: Task
    ) => { id: RequerimentsErrors; message: string }[] | null;
    public warnings: { id: RequerimentsErrors; message: string }[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public interval: any = null;

    constructor(data: {
        id: Tasks;
        assignedTo: string | null;
        baseTimeMs: number;
        available: boolean;
        requirements?: (
            baseBusiness: BaseBusiness,
            task: Task
        ) => { id: RequerimentsErrors; message: string }[] | null;
    }) {
        this.id = data.id;
        this.assignedTo = data.assignedTo;
        this.baseTimeMs = data.baseTimeMs;
        this.available = data.available;
        this.requirements = data.requirements;
    }
}
