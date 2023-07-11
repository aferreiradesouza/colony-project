import { HelperService } from '../../../../services/helpers.service';

interface ISkills {
    habilities: Array<Hability>;
}

export interface Hability {
    id: Skill;
    level: number | null;
}

export class Skills {
    public habilities: Array<Hability>;

    constructor(skills: ISkills) {
        this.habilities = this._createSkillList(skills.habilities);
    }

    private _createSkillList(habilities: Array<Hability>): Array<Hability> {
        return HelperService.enumToArray(Skill).map((e) => {
            const level = habilities.find(
                (hability) => hability.id === Skill[e]
            )?.level;
            return {
                id: Skill[e],
                level: level === undefined ? 1 : level,
            };
        });
    }

    getSkill(skill: Skill): Hability {
        return this.habilities.find((e) => e.id === skill)!;
    }
}

export enum Skill {
    Building,
    Social,
    Manufacture,
    Animals,
    Shot,
    Fight,
    Medicine,
    Agriculture,
    Cook,
    Agility,
    Strong,
}
