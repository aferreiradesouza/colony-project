export class Skills {
    public skills: Array<{ name: Skill; level: number }>;

    constructor(skills: Array<{ name: Skill; level: number }>) {
        this.skills = skills;
    }
}

export enum Skill {
    Construction,
    Social,
    Manufacture,
    Animals,
    Shot,
    Fight,
    Medicine,
    Agriculture,
}
