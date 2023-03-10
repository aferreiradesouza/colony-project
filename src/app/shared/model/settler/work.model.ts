import { HelperService } from 'src/app/shared/services/helpers.service';

interface IWork {
    workInProgressId?: Job;
    priorities: Priority[];
}

interface Priority {
    id: Job;
    weight?: number;
    value: number;
}

export class Work {
    workInProgressId: Job;
    priorities: Priority[];

    constructor(work: IWork) {
        this.workInProgressId = work.workInProgressId ?? Job.None;
        this.priorities = this._createPriorityList(work.priorities);
    }

    private _createPriorityList(priority: Array<Priority>): Array<Priority> {
        return HelperService.enumToArray(Job).map((e) => {
            const prioryObject = priority.find((f) => f.id === Job[e]);
            return {
                id: Job[e],
                weight: JobWeight[e],
                value: prioryObject?.value ?? 5,
            };
        });
    }
}

export enum Job {
    None,
    Construction,
    Agriculture,
    Kitchen,
    Clean,
}

export enum JobWeight {
    None = 0,
    Construction = 9,
    Agriculture = 8,
    Kitchen = 7,
    Clean = 6,
}
