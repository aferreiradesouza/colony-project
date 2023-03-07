import { HelperService } from 'src/app/shared/services/helpers.service';

interface IWork {
    id: Job;
    priorities: Priority[];
}

interface Priority {
    id: Job;
    weight: number;
    value: number;
}

export class Work {
    id: Job;
    priorities: Priority[];

    constructor(work: IWork) {
        this.id = work.id;
        this.priorities = this._createPriorityList(work.priorities);
    }

    private _createPriorityList(priority: Array<Priority>): Array<Priority> {
        return HelperService.enumToArray(Job).map((e) => {
            const prioryObject = priority.find((f) => f.id === Job[e]);
            return {
                id: Job[e],
                weight: 1,
                value: prioryObject?.value ?? 1,
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
