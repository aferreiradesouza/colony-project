import { Job, JobWeight } from 'src/app/shared/interface/enums/job.enum';
import { HelperService } from 'src/app/shared/services/helpers.service';

interface IWork {
    workInProgressId?: Job;
    priorities: Priority[];
    buildingId?: string | null;
}

interface Priority {
    id: Job;
    weight?: number;
    value: number;
}

export class Work {
    workInProgressId: Job;
    buildingId: string | null = null;
    priorities: Priority[];

    constructor(work: IWork) {
        this.buildingId = null;
        this.workInProgressId = Job.None;
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

    changePriority(job: Job, newWorkValue: number): void {
        const priority = this.priorities.find((e) => e.id === job);
        priority!.value = newWorkValue;
    }
}
