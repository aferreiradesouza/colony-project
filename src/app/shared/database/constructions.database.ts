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
                jobToCreateStructure: Job.Construction,
                timeMs: 2000,
                jobNecessary: null,
            },
            [Constructions?.House]: {
                id: Constructions?.House,
                jobToCreateStructure: Job.Construction,
                timeMs: 500000,
                jobNecessary: null,
            },
            [Constructions?.Kitchen]: {
                id: Constructions?.Kitchen,
                jobToCreateStructure: Job.Construction,
                timeMs: 8000,
                jobNecessary: Job.Kitchen,
            },
            [Constructions?.Farm]: {
                id: Constructions?.Farm,
                jobToCreateStructure: Job.Construction,
                timeMs: 2000,
                jobNecessary: Job.Agriculture,
            },
            [Constructions?.Factory]: {
                id: Constructions?.Factory,
                jobToCreateStructure: Job.Construction,
                timeMs: 35000,
                jobNecessary: Job.Construction,
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
