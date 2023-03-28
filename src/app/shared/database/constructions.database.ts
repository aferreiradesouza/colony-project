import { Constructions } from '../model/game/base/construction.model';
import { Job } from '../model/game/settler/work.model';

export interface IConstructionDatabase {
    id: Constructions;
    jobToCreateStructure: Job;
    timeMs: number;
    jobNecessary: Job | null;
    timeForWork: number;
}

export class ConstructionDatabase {
    constructor() {}

    static get structures(): { [key in Constructions]: IConstructionDatabase } {
        return {
            [Constructions?.Storage]: {
                id: Constructions?.Storage,
                jobToCreateStructure: Job.Builder,
                timeMs: 5000,
                jobNecessary: null,
                timeForWork: 1000,
            },
            [Constructions?.House]: {
                id: Constructions?.House,
                jobToCreateStructure: Job.Builder,
                timeMs: 10000,
                jobNecessary: null,
                timeForWork: 1000,
            },
            [Constructions?.Kitchen]: {
                id: Constructions?.Kitchen,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Kitchen,
                timeForWork: 1000,
            },
            [Constructions?.Farm]: {
                id: Constructions?.Farm,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Agriculture,
                timeForWork: 1000,
            },
            [Constructions?.Factory]: {
                id: Constructions?.Factory,
                jobToCreateStructure: Job.Builder,
                timeMs: 35000,
                jobNecessary: Job.Builder,
                timeForWork: 1000,
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
