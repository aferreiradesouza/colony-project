import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Job } from 'src/app/shared/interface/enums/job.enum';
import {
    BuildingDatabase,
    IBuildingDatabase,
} from '../../../../database/building.database';
import { HelperService } from '../../../../services/helpers.service';
import { Task } from './task.model';
import { Itens } from 'src/app/shared/interface/enums/item.enum';
import { RequerimentsWarning } from 'src/app/shared/database/task.database';
import { BaseBusiness } from 'src/app/shared/business/base.business';

export type BuildingStatus = 'not-started' | 'building' | 'paused' | 'done';
export type BuildingResource = { id: Itens; amount: number };

export interface IBuilding {
    id?: string;
    type: Buildings;
    status?: BuildingStatus;
    assignedTo?: string | null;
    timeMs?: number;
    tasks?: Task[];
}

export class Building {
    public id: string;
    public type: Buildings;
    public status: BuildingStatus;
    public jobNecessary: Job | null;
    public jobToCreateStructure: Job;
    public timeMs: number;
    public assignedTo: string | null = null;
    public percent = 0;
    public tasks: Task[] = [];
    public warnings: RequerimentsWarning = [];
    public resources: BuildingResource[] = [];
    public requirements?: (
        baseBusiness: BaseBusiness,
        building: Building
    ) => RequerimentsWarning;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public interval: any = null;

    constructor(building: IBuilding) {
        this.type = building.type;
        this.status =
            building?.status === 'building'
                ? 'paused'
                : building.status ?? 'not-started';
        this.id = building.id ?? HelperService.guid;
        const structure = this._getDatabase(building.type);
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
}
