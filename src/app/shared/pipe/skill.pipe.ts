import { Pipe, PipeTransform } from '@angular/core';
import { Skill } from '../model/game/base/settler/skill.model';

@Pipe({
    name: 'skill',
})
export class SkillPipe implements PipeTransform {
    transform(value: Skill): string {
        return this._getSkill(value);
    }

    private _getSkill(skill: Skill): string {
        const skills: { [key in Skill]: string } = {
            [Skill.Agriculture]: 'Agricultura',
            [Skill.Animals]: 'Animais',
            [Skill.Building]: 'Construção',
            [Skill.Fight]: 'Luta',
            [Skill.Manufacture]: 'Fabricação',
            [Skill.Medicine]: 'Medicina',
            [Skill.Shot]: 'Tiro',
            [Skill.Social]: 'Social',
            [Skill.Cook]: 'Cozinhar',
            [Skill.Agility]: 'Agilidade',
            [Skill.Strong]: 'Força',
        };
        return skills[skill];
    }
}
