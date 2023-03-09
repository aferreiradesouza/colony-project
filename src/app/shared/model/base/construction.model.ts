import {
    ConstructionDatabase,
    IConstructionDatabase,
} from '../../database/constructions.database';
import { Settler } from '../settler/settler.model';
import { Job } from '../settler/work.model';

export type ConstructionStatus = 'not-started' | 'pending' | 'done';

export class Construction {
    public id: Constructions;
    public status: ConstructionStatus;
    public jobNecessary: Job | null;
    public jobToCreateStructure: Job;
    public timeMs: number;
    public assignTo: Settler | null = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private interval: any;

    constructor(construction: {
        id: Constructions;
        status: ConstructionStatus;
    }) {
        this.id = construction.id;
        this.status = construction.status;

        const structure = this._getDatabase(construction.id);
        this.jobNecessary = structure.jobNecessary;
        this.jobToCreateStructure = structure.jobToCreateStructure;
        this.timeMs = structure.timeMs;
    }

    private _getDatabase(id: Constructions): IConstructionDatabase {
        return ConstructionDatabase.getConstruction(id);
    }

    create(): void {
        this.status = 'pending';
        this.interval = setInterval(() => {
            this.timeMs -= 1000;
            if (this.timeMs === 0) this.done();
        }, 1000);
    }

    assignSettler(worker: Settler, work: Job | null): void {
        this.assignTo = work ? worker : null;
        if (work) worker.assignWork(this.jobToCreateStructure);
        else worker.assignWork(null);
    }

    stop(): void {
        clearInterval(this.interval);
        this.assignSettler(this.assignTo!, null);
    }

    done(): void {
        clearInterval(this.interval);
        this.status = 'done';
        this.assignSettler(this.assignTo!, null);
    }
}

export enum Constructions {
    House,
    Storage,
    Kitchen,
    Farm,
    Factory,
}
