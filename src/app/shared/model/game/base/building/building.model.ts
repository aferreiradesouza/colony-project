import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Job } from 'src/app/shared/interface/enums/job.enum';
import {
    BuildingDatabase,
    IBuildingDatabase,
} from '../../../../database/building.database';
import { HelperService } from '../../../../services/helpers.service';
import { Task } from './task.model';

export type BuildingStatus = 'not-started' | 'building' | 'paused' | 'done';

export interface IBuilding {
    id?: string;
    type: Buildings;
    status?: BuildingStatus;
    assignedTo?: string | null;
    timeMs?: number;
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
        // building.timeMs ?? this.status === 'done' ? 0 : structure.timeMs;
        // this.assignedTo = building.assignedTo ?? null
    }

    private _getDatabase(id: Buildings): IBuildingDatabase {
        return BuildingDatabase.getBuildingById(id);
    }
}
