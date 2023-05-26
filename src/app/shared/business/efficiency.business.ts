import { Injectable } from '@angular/core';
import { Settler } from '../model/game/base/settler/settler.model';
import { Task } from '../model/game/base/building/task.model';
import { SettlersBusiness } from './settlers.business';
import { Skill } from '../model/game/base/settler/skill.model';

@Injectable({ providedIn: 'root' })
export class EfficiencyBusiness {
    constructor() {}

    static efficencySimpleMeal(task: Task, settler: Settler): void {
        const skill = settler.skills.habilities.find(
            (e) => e.id === Skill.Cook
        );
        if (skill) {
            const percent = ((skill.level ?? 0) * 100) / 20;
            // console.log(task.baseTimeMs, (percent / 100) * task.baseTimeMs);
            task.baseTimeMs -= (percent / 100) * task.baseTimeMs;
        }
        console.log(task);
    }
}
