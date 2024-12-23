/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BaseBusiness } from '../business/base.business';
import { Biomes } from '../interface/enums/biomes.enum';
import { Buildings } from '../interface/enums/buildings.enum';
import { Items } from '../interface/enums/item.enum';
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
    biomesAllowed: Biomes[];
    tasksAllowed?: Tasks[];
    requirements?: (
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
                biomesAllowed: [Biomes.Lake],
                resources: [],
            },
            [Buildings?.House]: {
                id: Buildings?.House,
                jobToCreateStructure: Job.Builder,
                timeMs: 10000,
                jobNecessary: null,
                timeForWork: 1000,
                name: 'Casa',
                biomesAllowed: [Biomes.Lake],
                requirements: BuildingValidation.requirementsHouse,
                resources: [
                    { id: Items.Wood, amount: 200 },
                    { id: Items.Stone, amount: 200 },
                ],
            },
            [Buildings?.Kitchen]: {
                id: Buildings?.Kitchen,
                jobToCreateStructure: Job.Builder,
                timeMs: 10000,
                jobNecessary: Job.Kitchen,
                tasksAllowed: [Tasks.RefeicaoCompleta, Tasks.RefeicaoSimples],
                timeForWork: 1000,
                name: 'Cozinha',
                biomesAllowed: [Biomes.Lake],
                requirements: BuildingValidation.requirementsHouse,
                resources: [
                    { id: Items.Wood, amount: 200 },
                    { id: Items.Stone, amount: 200 },
                ],
            },
            [Buildings?.Farm]: {
                id: Buildings?.Farm,
                jobToCreateStructure: Job.Builder,
                timeMs: 2000,
                jobNecessary: Job.Agriculture,
                timeForWork: 1000,
                name: 'Fazenda',
                biomesAllowed: [Biomes.Lake],
                requirements: BuildingValidation.requirementsHouse,
                resources: [{ id: Items.Wood, amount: 100 }],
            },
            [Buildings?.Factory]: {
                id: Buildings?.Factory,
                jobToCreateStructure: Job.Builder,
                timeMs: 35000,
                jobNecessary: Job.Builder,
                timeForWork: 1000,
                name: 'Fábrica',
                biomesAllowed: [Biomes.Lake],
                requirements: BuildingValidation.requirementsHouse,
                resources: [{ id: Items.Wood, amount: 100 }],
            },
            [Buildings?.Camping]: {
                id: Buildings?.Camping,
                jobToCreateStructure: Job.Builder,
                timeMs: 30000,
                jobNecessary: Job.Cut,
                tasksAllowed: [Tasks.ObterMadeira],
                timeForWork: 1000,
                name: 'Acampamento',
                biomesAllowed: [Biomes.Forest],
                resources: [],
            },
            [Buildings?.Quarry]: {
                id: Buildings?.Quarry,
                jobToCreateStructure: Job.Builder,
                timeMs: 30000,
                jobNecessary: Job.Mining,
                tasksAllowed: [Tasks.ObterPedra],
                timeForWork: 1000,
                name: 'Pedreira',
                biomesAllowed: [Biomes.Forest],
                resources: [],
            },
            [Buildings?.HunterHouse]: {
                id: Buildings?.HunterHouse,
                jobToCreateStructure: Job.Builder,
                timeMs: 30000,
                jobNecessary: Job.Hunt,
                tasksAllowed: [Tasks.ObterCarne],
                timeForWork: 2000,
                name: 'Casa do caçador',
                biomesAllowed: [Biomes.Forest],
                resources: [],
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
