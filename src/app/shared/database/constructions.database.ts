import { Constructions } from '../model/base/construction.model';
import { Job } from '../model/settler/work.model';

export interface ConstructionDatabase {
    id: Constructions;
    job: Job;
}

export const CONSTRUCTIONS: { [key in Constructions]: ConstructionDatabase } = {
    [Constructions.Redidence]: {
        id: Constructions.Redidence,
        job: Job.Construction,
    },
    [Constructions.Storage]: {
        id: Constructions.Storage,
        job: Job.Construction,
    },
    [Constructions.Kitchen]: {
        id: Constructions.Kitchen,
        job: Job.Construction,
    },
};
