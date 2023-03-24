import { Constructions } from '../model/base/construction.model';
import { Job } from '../model/settler/work.model';

export interface IConstructionDatabase {
    id: Constructions;
    jobToCreateStructure: Job;
    timeMs: number;
    jobNecessary: Job | null;
}

export class ConstructionDatabase {
    constructor() {}

    static get structures(): { [key in Constructions]: IConstructionDatabase } {
        return {
            [Constructions?.Storage]: {
                id: Constructions?.Storage,
                jobToCreateStructure: Job.Builder,
                timeMs: 15000,
                jobNecessary: null,
            },
            [Constructions?.House]: {
                id: Constructions?.House,
                jobToCreateStructure: Job.Builder,
                timeMs: 10000,
                jobNecessary: null,
            },
            [Constructions?.Kitchen]: {
                id: Constructions?.Kitchen,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Kitchen,
            },
            [Constructions?.Farm]: {
                id: Constructions?.Farm,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Agriculture,
            },
            [Constructions?.Factory]: {
                id: Constructions?.Factory,
                jobToCreateStructure: Job.Builder,
                timeMs: 35000,
                jobNecessary: Job.Builder,
            },
        };
    }

    static get constructionsList(): IConstructionDatabase[] {
        return Object.values(ConstructionDatabase.structures);
    }

    static getConstruction(id: Constructions): IConstructionDatabase {
        return ConstructionDatabase.structures[id];
    }
}
