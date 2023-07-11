export enum Job {
    None,
    Builder,
    Mining,
    Cut,
    Agriculture,
    Kitchen,
    Clean,
}

export enum JobWeight {
    None = 0,
    Builder = 6,
    Agriculture = 5,
    Kitchen = 4,
    Mining = 3,
    Cut = 2,
    Clean = 1,
}
