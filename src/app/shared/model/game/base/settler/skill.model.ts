import { Skill } from 'src/app/shared/interface/enums/skill.enum';
import { HelperService } from '../../../../services/helpers.service';

export interface Ability {
    id: Skill;
    level: number | null;
}

interface SkillsData {
    abilities: Array<Ability>;
}

export class Skills {
    public abilities: Array<Ability>;

    constructor(skills: SkillsData) {
        this.abilities = this.createSkillList(skills.abilities);
    }

    /**
     * Creates a list of abilities with default levels if not provided.
     * @param habilities - The array of abilities to process.
     * @returns An array of abilities with default levels.
     */
    private createSkillList(habilities: Array<Ability>): Array<Ability> {
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

    /**
     * Retrieves the ability for a given skill.
     * @param skill - The skill to retrieve the ability for.
     * @returns The ability associated with the given skill.
     */
    getSkill(skill: Skill): Ability {
        const ability = this.abilities.find((e) => e.id === skill)!;
        return ability;
    }
}
