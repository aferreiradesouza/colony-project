import { Injectable } from '@angular/core';
import { Settler } from '../model/game/base/settler/settler.model';
import { Ability } from '../model/game/base/settler/skill.model';
import { Skill } from '../interface/enums/skill.enum';

@Injectable({ providedIn: 'root' })
export class EfficiencyBusiness {
    static maxEfficiency = 200;
    static minEfficiency = 15;
    static defaultEfficiency = 100;
    static maxLevelSkill = 20;
    static defaultLevelSkill = 7;
    static minLevelSkill = 1;
    static minMsCap = 100;

    constructor() {}

    static Cook(settler: Settler): number {
        const skill = settler.skills.getSkill(Skill.Cook);
        return EfficiencyBusiness.calculate(skill);
    }

    static Agility(settler: Settler): number {
        const skill = settler.skills.getSkill(Skill.Agility);
        return EfficiencyBusiness.calculate(skill);
    }

    static Strong(settler: Settler): number {
        const skill = settler.skills.getSkill(Skill.Strong);
        return EfficiencyBusiness.calculate(skill);
    }

    static Shoot(settler: Settler): number {
        const skill = settler.skills.getSkill(Skill.Shoot);
        return EfficiencyBusiness.calculate(skill);
    }

    static Building(settler: Settler): number {
        const skill = settler.skills.getSkill(Skill.Building);
        return EfficiencyBusiness.calculate(skill);
    }

    static calculate(skill: Ability | undefined): number {
        if (skill && skill.level) {
            if (skill.level === EfficiencyBusiness.defaultLevelSkill) {
                return EfficiencyBusiness.defaultEfficiency;
            } else if (skill.level > EfficiencyBusiness.defaultLevelSkill) {
                return (
                    ((EfficiencyBusiness.maxEfficiency -
                        EfficiencyBusiness.defaultEfficiency) /
                        (EfficiencyBusiness.maxLevelSkill -
                            EfficiencyBusiness.defaultLevelSkill)) *
                        (skill.level - EfficiencyBusiness.defaultLevelSkill) +
                    EfficiencyBusiness.defaultEfficiency
                );
            } else {
                return (
                    EfficiencyBusiness.defaultEfficiency -
                    ((EfficiencyBusiness.defaultEfficiency -
                        EfficiencyBusiness.minEfficiency) /
                        (EfficiencyBusiness.defaultLevelSkill -
                            EfficiencyBusiness.minLevelSkill)) *
                        (EfficiencyBusiness.defaultLevelSkill - skill.level)
                );
            }
        } else {
            return EfficiencyBusiness.minEfficiency;
        }
    }

    static calculateEfficiency(
        baseNumber: number,
        skill: Skill,
        settler: Settler,
        invertLogic = true
    ): number {
        const ability = settler.skills.getSkill(skill);
        const efficiency = EfficiencyBusiness.calculate(ability) / 100;
        const maxEfficiency = EfficiencyBusiness.maxEfficiency / 100;
        return baseNumber * (invertLogic ? (maxEfficiency - efficiency) : efficiency);
    }
}
