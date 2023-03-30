/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Buildings } from '../interface/enums/buildings.enum';
import { Job } from '../interface/enums/job.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import { Game } from '../model/game/game.model';

export interface IBuildingDatabase {
    id: Buildings;
    jobToCreateStructure: Job;
    timeMs: number;
    jobNecessary: Job | null;
    timeForWork: number;
    name: string;
    tasks?: ITaskBuildingDatabase[];
}

export interface ITaskBuildingDatabase {
    id: Tasks;
    baseTimeMs: number;
    assignedTo: string | null;
    available: boolean;
    requirements?: (game: Game) => { id: string; message: string }[] | null;
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
                tasks: [
                    {
                        id: Tasks.RefeicaoSimples,
                        assignedTo: null,
                        baseTimeMs: 2000,
                        available: false,
                        requirements: (game) => {
                            return [{ id: 'string', message: 'string' }];
                        },
                    },
                    {
                        id: Tasks.RefeicaoMediana,
                        assignedTo: null,
                        baseTimeMs: 5000,
                        available: false,
                        requirements: (game) => {
                            return [{ id: 'string', message: 'string' }];
                        },
                    },
                    {
                        id: Tasks.RefeicaoCompleta,
                        assignedTo: null,
                        baseTimeMs: 10000,
                        available: false,
                        requirements: (game) => {
                            return [{ id: 'string', message: 'string' }];
                        },
                    },
                ],
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

    static getTaskBuildingById(
        id: Buildings,
        idTask: Tasks
    ): ITaskBuildingDatabase | null {
        return (
            BuildingDatabase.structures[id].tasks?.find(
                (e) => e.id === idTask
            ) ?? null
        );
    }
}
