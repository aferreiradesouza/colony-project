import { Skill } from 'src/app/shared/interface/enums/skill.enum';
import { HelperService } from '../../../../services/helpers.service';

interface SkillsData {
    abilities: Array<Hability>;
}

export interface Hability {
    id: Skill;
    level: number | null;
}

export class Skills {
    public abilities: Array<Hability>;

    constructor(skills: SkillsData) {
        this.abilities = this.createSkillList(skills.abilities);
    }

    private createSkillList(habilities: Array<Hability>): Array<Hability> {
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
        return this.abilities.find((e) => e.id === skill)!;
    }
}
