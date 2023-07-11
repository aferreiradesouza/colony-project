import { Injectable } from '@angular/core';
import { Settler } from '../model/game/base/settler/settler.model';
import { Hability, Skill } from '../model/game/base/settler/skill.model';

@Injectable({ providedIn: 'root' })
export class EfficiencyBusiness {
    static maxEfficiency = 150;
    static minEfficiency = 50;
    static defaultEfficiency = 100;
    static maxLevelSkill = 20;
    static defaultLevelSkill = 7;
    static minLevelSkill = 1;

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

    static calculate(skill: Hability | undefined): number {
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
        baseTimeMs: number,
        skill: Skill,
        settler: Settler,
        invertLogicFromFaster = false
    ): number {
        const hability = settler.skills.getSkill(skill);
        const efficiency = EfficiencyBusiness.calculateEfficiencyWithPercent(
            EfficiencyBusiness.calculate(hability),
            invertLogicFromFaster
        );
        return baseTimeMs * efficiency;
    }

    static calculateEfficiencyWithPercent(
        value: number,
        invertLogicFromFaster: boolean
    ): number {
        if (invertLogicFromFaster) return value / 100;
        if (value < EfficiencyBusiness.defaultEfficiency) {
            return (
                (EfficiencyBusiness.defaultEfficiency -
                    value +
                    EfficiencyBusiness.defaultEfficiency) /
                100
            );
        } else {
            return (
                (EfficiencyBusiness.defaultEfficiency -
                    (value - EfficiencyBusiness.defaultEfficiency)) /
                100
            );
        }
    }
}
