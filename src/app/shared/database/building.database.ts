import { Buildings } from '../interface/enums/buildings.enum';
import { Job } from '../interface/enums/job.enum';

export interface IBuildingDatabase {
    id: Buildings;
    jobToCreateStructure: Job;
    timeMs: number;
    jobNecessary: Job | null;
    timeForWork: number;
    name: string;
}

export class BuildingDatabase {
    constructor() {}

    static get structures(): { [key in Buildings]: IBuildingDatabase } {
        return {
            [Buildings?.Storage]: {
                id: Buildings?.Storage,
                jobToCreateStructure: Job.Builder,
                timeMs: 5000,
                jobNecessary: null,
                timeForWork: 1000,
                name: 'Armazém',
            },
            [Buildings?.House]: {
                id: Buildings?.House,
                jobToCreateStructure: Job.Builder,
                timeMs: 10000,
                jobNecessary: null,
                timeForWork: 1000,
                name: 'Casa',
            },
            [Buildings?.Kitchen]: {
                id: Buildings?.Kitchen,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Kitchen,
                timeForWork: 1000,
                name: 'Cozinha',
            },
            [Buildings?.Farm]: {
                id: Buildings?.Farm,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Agriculture,
                timeForWork: 1000,
                name: 'Fazenda',
            },
            [Buildings?.Factory]: {
                id: Buildings?.Factory,
                jobToCreateStructure: Job.Builder,
                timeMs: 35000,
                jobNecessary: Job.Builder,
                timeForWork: 1000,
                name: 'Fábrica',
            },
        };
    }

    static get buildingsList(): IBuildingDatabase[] {
        return Object.values(BuildingDatabase.structures);
    }

    static getBuildingById(id: Buildings): IBuildingDatabase {
        return BuildingDatabase.structures[id];
    }
}
