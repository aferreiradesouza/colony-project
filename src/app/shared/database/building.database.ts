/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BaseBusiness } from '../business/base.business';
import { Buildings } from '../interface/enums/buildings.enum';
import { Itens } from '../interface/enums/item.enum';
import { Job } from '../interface/enums/job.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import {
    Building,
    BuildingResource,
} from '../model/game/base/building/building.model';
import { BuildingValidation } from '../validation/building.validation';
import { ITaskDatabase, RequerimentsWarning } from './task.database';

export interface IBuildingDatabase {
    id: Buildings;
    jobToCreateStructure: Job;
    timeMs: number;
    jobNecessary: Job | null;
    timeForWork: number;
    name: string;
    tasks?: ITaskDatabase[];
    resources?: BuildingResource[];
    requirements?: (
        baseBusiness: BaseBusiness,
        building: Building
    ) => RequerimentsWarning;
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
                resources: [
                    { id: Itens.Wood, amount: 200 },
                    { id: Itens.Stone, amount: 200 },
                ],
            },
            [Buildings?.House]: {
                id: Buildings?.House,
                jobToCreateStructure: Job.Builder,
                timeMs: 10000,
                jobNecessary: null,
                timeForWork: 1000,
                name: 'Casa',
                requirements: BuildingValidation.requirementsHouse,
                resources: [{ id: Itens.Wood, amount: 1000 }],
            },
            [Buildings?.Kitchen]: {
                id: Buildings?.Kitchen,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Kitchen,
                timeForWork: 1000,
                name: 'Cozinha',
                requirements: BuildingValidation.requirementsHouse,
                resources: [{ id: Itens.Wood, amount: 100 }],
            },
            [Buildings?.Farm]: {
                id: Buildings?.Farm,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Agriculture,
                timeForWork: 1000,
                name: 'Fazenda',
                requirements: BuildingValidation.requirementsHouse,
                resources: [{ id: Itens.Wood, amount: 100 }],
            },
            [Buildings?.Factory]: {
                id: Buildings?.Factory,
                jobToCreateStructure: Job.Builder,
                timeMs: 35000,
                jobNecessary: Job.Builder,
                timeForWork: 1000,
                name: 'Fábrica',
                requirements: BuildingValidation.requirementsHouse,
                resources: [{ id: Itens.Wood, amount: 100 }],
            },
        };
    }

    static get buildingsList(): IBuildingDatabase[] {
        return Object.values(BuildingDatabase.structures);
    }

    static getBuildingById(id: Buildings): IBuildingDatabase {
        return BuildingDatabase.structures[id];
    }

    static getTaskBuildingById(
        id: Buildings,
        idTask: Tasks
    ): ITaskDatabase | null {
        return (
            BuildingDatabase.structures[id].tasks?.find(
                (e) => e.id === idTask
            ) ?? null
        );
    }
}
