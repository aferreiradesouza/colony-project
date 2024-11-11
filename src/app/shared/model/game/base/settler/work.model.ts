import { Job, JobWeight } from 'src/app/shared/interface/enums/job.enum';
import { HelperService } from 'src/app/shared/services/helpers.service';

interface WorkData {
    workInProgressId?: Job;
    priorities: Priority[];
    buildingId?: string | null;
}

export interface Priority {
    id: Job;
    weight?: number;
    value: number;
}

export class Work {
    workInProgressId?: Job;
    taskId: string | null = null;
    priorities: Priority[];
    constructor(work: WorkData) {
        this.workInProgressId = Job.None;
        this.priorities = this.buildPriorityList(work.priorities);
    }

    /**
     * Creates a priority list based on the provided priorities.
     * @param priorities - An array of Priority objects.
     * @returns An array of Priority objects with default values if not provided.
     */
    private buildPriorityList(priorities: Array<Priority>): Array<Priority> {
        return HelperService.enumToArray(Job).map((e) => {
            const priorityObject = priorities.find((f) => f.id === Job[e]);
            return {
                id: Job[e],
                weight: JobWeight[e],
                value: priorityObject?.value ?? 5,
            };
        });
    }

    /**
     * Changes the priority value for a specific job.
     * @param job - The job for which the priority value needs to be changed.
     * @param newWorkValue - The new priority value.
     */
    changePriority(job: Job, newWorkValue: number): void {
        const priority = this.priorities.find((e) => e.id === job);
        priority!.value = newWorkValue;
    }

    /**
     * Sets the task ID to the provided building ID.
     * @param buildingId - The ID of the building to set as the task ID.
     */
    setTaskId(buildingId: string | null): void {
        this.taskId = buildingId;
    }

    /**
     * Sets the work in progress ID to the given job.
     *
     * @param job - The job to set as the current work in progress.
     */
    setWorkInProgressId(job: Job): void {
        this.workInProgressId = job;
    }
}
