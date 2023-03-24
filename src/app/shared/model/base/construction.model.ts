import { EventEmitter } from '@angular/core';
import {
    ConstructionDatabase,
    IConstructionDatabase,
} from '../../database/constructions.database';
import { HelperService } from '../../services/helpers.service';
import { Settler } from '../settler/settler.model';
import { Job } from '../settler/work.model';

export type ConstructionStatus = 'not-started' | 'building' | 'paused' | 'done';

export class Construction {
    public id: string;
    public type: Constructions;
    public status: ConstructionStatus;
    public jobNecessary: Job | null;
    public jobToCreateStructure: Job;
    public timeMs: number;
    public assignTo: Settler | null = null;
    public percent = 0;
    public onChangeStatus = new EventEmitter<{
        status: ConstructionStatus;
        structure: Constructions;
    }>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private interval: any = null;

    constructor(construction: {
        id?: string;
        type: Constructions;
        status?: ConstructionStatus;
    }) {
        this.type = construction.type;
        this.status = construction.status ?? 'not-started';
        this.id = construction.id ?? HelperService.guid;
        const structure = this._getDatabase(construction.type);
        this.jobNecessary = structure.jobNecessary;
        this.jobToCreateStructure = structure.jobToCreateStructure;
        this.timeMs = structure.timeMs;
    }

    private _getDatabase(id: Constructions): IConstructionDatabase {
        return ConstructionDatabase.getConstruction(id);
    }

    create(): void {
        this.changeStatus('building');
        this.interval = setInterval(() => {
            this.timeMs -= 1000;
            this.calculatePercent();
            if (this.timeMs === 0) this.done();
        }, 1000);
    }

    resume(): void {
        this.interval = setInterval(() => {
            this.timeMs -= 1000;
            this.calculatePercent();
            if (this.timeMs === 0) this.done();
        }, 1000);
    }

    private calculatePercent(): void {
        const fullTime = ConstructionDatabase.getConstruction(this.type).timeMs;
        this.percent = Number(
            (100 - (100 * this.timeMs) / fullTime).toFixed(2)
        );
    }

    assignSettler(worker: Settler, work: Job): void {
        this.assignTo = worker;
        worker.assignWork(work, this);
    }

    unassignSettler(worker: Settler | null): void {
        this.assignTo = null;
        worker?.unassignWork();
    }

    stop(): void {
        clearInterval(this.interval);
        this.unassignSettler(this.assignTo!);
    }

    done(): void {
        clearInterval(this.interval);
        this.changeStatus('done');
        this.unassignSettler(this.assignTo!);
    }

    private changeStatus(status: ConstructionStatus): void {
        this.status = status;
        this.onChangeStatus.emit({ status: this.status, structure: this.type });
    }

    get job(): Job | null {
        return this.status === 'done'
            ? this.jobNecessary
            : this.jobToCreateStructure;
    }
}

export enum Constructions {
    House,
    Storage,
    Kitchen,
    Farm,
    Factory,
}
