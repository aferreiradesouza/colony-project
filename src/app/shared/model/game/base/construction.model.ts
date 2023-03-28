import { EventEmitter } from '@angular/core';
import {
    ConstructionDatabase,
    IConstructionDatabase,
} from '../../../database/constructions.database';
import { HelperService } from '../../../services/helpers.service';
import { Job } from '../settler/work.model';

export type ConstructionStatus = 'not-started' | 'building' | 'paused' | 'done';

export class Construction {
    public id: string;
    public type: Constructions;
    public status: ConstructionStatus;
    public jobNecessary: Job | null;
    public jobToCreateStructure: Job;
    public timeMs: number;
    public assignedTo: string | null = null;
    public percent = 0;
    public onWork = new EventEmitter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public interval: any = null;

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
}

export enum Constructions {
    House,
    Storage,
    Kitchen,
    Farm,
    Factory,
}
