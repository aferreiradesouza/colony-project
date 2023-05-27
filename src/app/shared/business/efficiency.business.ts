import { Injectable } from '@angular/core';
import { Settler } from '../model/game/base/settler/settler.model';
import { Task } from '../model/game/base/building/task.model';
import { SettlersBusiness } from './settlers.business';
import { Skill } from '../model/game/base/settler/skill.model';

@Injectable({ providedIn: 'root' })
export class EfficiencyBusiness {
    static maxEfficiency = 150;
    static minEfficiency = 50;
    static defaultEfficiency = 100;
    static maxLevelSkill = 20;
    static defaultLevelSkill = 7;

    constructor() {}

    static efficencySimpleMeal(task: Task, settler: Settler): number {
        const skill = settler.skills.habilities.find(
            (e) => e.id === Skill.Cook
        );
        if (skill && skill.level) {
            if (skill.level === EfficiencyBusiness.defaultLevelSkill)
                return EfficiencyBusiness.defaultEfficiency;
            else if (skill.level > EfficiencyBusiness.defaultLevelSkill)
                return (
                    ((EfficiencyBusiness.maxEfficiency -
                        EfficiencyBusiness.defaultEfficiency) /
                        (EfficiencyBusiness.maxLevelSkill - 7)) *
                    (skill.level - EfficiencyBusiness.defaultLevelSkill) + EfficiencyBusiness.defaultEfficiency
                );
            else
                return (
                    (EfficiencyBusiness.defaultEfficiency -
                        EfficiencyBusiness.minEfficiency /
                            EfficiencyBusiness.defaultLevelSkill) *
                    (EfficiencyBusiness.defaultLevelSkill - skill.level) - EfficiencyBusiness.defaultEfficiency
                );
        } else {
            return EfficiencyBusiness.minEfficiency;
        }
    }
}
