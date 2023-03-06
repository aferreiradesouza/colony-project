export class Work {
    id: Job;
    name: string;
    priority: {
        id: Job;
        weight: number;
    }[] = [];

    constructor(work: { id: Job; name: string }) {
        this.id = work.id;
        this.name = work.name;
    }
}

export enum Job {
    None,
    Construction,
    Agriculture,
}
