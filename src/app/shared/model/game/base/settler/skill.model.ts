import { HelperService } from '../../../../services/helpers.service';

interface ISkills {
    habilities: Array<Habilities>;
}

interface Habilities {
    id: Skill;
    level: number | null;
}

export class Skills {
    public habilities: Array<Habilities>;

    constructor(skills: ISkills) {
        this.habilities = this._createSkillList(skills.habilities);
    }

    _createSkillList(habilities: Array<Habilities>): Array<Habilities> {
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
}
