export enum Job {
    None,
    Builder,
    Mining,
    Cut,
    Agriculture,
    Kitchen,
    Clean,
    Hunt,
}

export enum JobWeight {
    None = 0,
    Builder = 7,
    Agriculture = 6,
    Hunt = 5,
    Kitchen = 4,
    Mining = 3,
    Cut = 2,
    Clean = 1,
}
