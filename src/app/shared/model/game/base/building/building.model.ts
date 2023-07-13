import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Job } from 'src/app/shared/interface/enums/job.enum';
import {
    BuildingDatabase,
    IBuildingDatabase,
} from '../../../../database/building.database';
import { HelperService } from '../../../../services/helpers.service';
import { Task } from './task.model';
import { Items } from 'src/app/shared/interface/enums/item.enum';
import { RequerimentsWarning } from 'src/app/shared/database/task.database';
import { BaseBusiness } from 'src/app/shared/business/base.business';
import { Item } from './storage/item.model';
import { Biomes } from 'src/app/shared/interface/enums/biomes.enum';
import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';

export type BuildingStatus = 'not-started' | 'building' | 'paused' | 'done';
export type BuildingResource = { id: Items; amount: number };

export interface IBuilding {
    id?: string;
    type: Buildings;
    status?: BuildingStatus;
    inventory?: Item[];
    assignedTo?: string | null;
    timeMs?: number;
    tasks?: Task[];
    biome: Biomes;
}

export class Building {
    public id: string;
    public type: Buildings;
    public status: BuildingStatus;
    public jobNecessary: Job | null;
    public tasksAllowed?: Tasks[];
    public jobToCreateStructure: Job;
    public timeMs: number;
    public assignedTo: string | null = null;
    public percent = 0;
    public biome: Biomes;
    public tasks: Task[] = [];
    public inventory: Array<Item>;
    public warnings: RequerimentsWarning = [];
    public resources: BuildingResource[] = [];
    public requirements?: (
        baseBusiness: BaseBusiness,
        building: Building
    ) => RequerimentsWarning;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public buildStorageInterval: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getItemFromStorageInterval: any = null;

    constructor(building: IBuilding) {
        this.biome = building.biome;
        this.type = building.type;
        this.inventory = building.inventory ?? [];
        this.status =
            building?.status === 'building'
                ? 'paused'
                : building.status ?? 'not-started';
        this.id = building.id ?? HelperService.guid;
        const structure = this._getDatabase(building.type);
        this.tasksAllowed = structure.tasksAllowed;
        this.jobNecessary = structure.jobNecessary;
        this.jobToCreateStructure = structure.jobToCreateStructure;
        this.timeMs = building.timeMs ?? structure.timeMs;
        this.resources = structure.resources ?? [];
        this.requirements = structure.requirements;
        this.tasks =
            building.tasks?.map(
                (e) =>
                    new Task({
                        ...e,
                        consumption: e.consumption ?? [],
                        assignedTo: null,
                    })
            ) ?? [];
    }

    private _getDatabase(id: Buildings): IBuildingDatabase {
        return BuildingDatabase.getBuildingById(id);
    }

    addWarning(errors: RequerimentsWarning): void {
        this.warnings = errors ?? [];
    }

    clearWarning(): void {
        this.warnings = [];
    }
}
