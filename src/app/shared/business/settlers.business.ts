import { Injectable } from '@angular/core';
import { Job } from '../interface/enums/job.enum';
import { Settler } from '../model/game/base/settler/settler.model';
import { GameBusiness } from './game.business';
import { Ability } from '../model/game/base/settler/skill.model';
import { Business } from './business';
import { Skill } from '../interface/enums/skill.enum';

@Injectable({ providedIn: 'root' })
export class SettlersBusiness {
    constructor() {}

    get settlers(): Settler[] {
        return Business.gameBusiness.game.base.settlers;
    }

    public add(settler: Settler): void {
        Business.gameBusiness.game.base.settlers.push(settler);
    }

    public replace(settler: Settler[]): void {
        Business.gameBusiness.game.base.settlers = settler;
    }

    getSettlerById(id: string): Settler | null {
        return this.settlers.find((e) => e.id === id) ?? null;
    }

    assignWork(id: string, idContruction: string, job: Job): void {
        const settler = this.getSettlerById(id) as Settler;
        settler.work.workInProgressId = job;
        settler.work.taskId = idContruction;
    }

    unassignWork(id: string): void {
        const settler = this.getSettlerById(id) as Settler;
        settler.work.workInProgressId = Job.None;
        settler.work.taskId = null;
    }

    getWorkValue(id: string, job: Job): number {
        const settler = this.getSettlerById(id) as Settler;
        return settler.work.priorities.filter((e) => e.id === job)[0].value;
    }

    getWorkWeight(id: string, job: Job): number {
        const settler = this.getSettlerById(id) as Settler;
        return settler.work.priorities.filter((e) => e.id === job)[0].weight!;
    }

    changeWorkValue(idSettler: string, newWorkValue: number, job: Job): void {
        const settler = this.getSettlerById(idSettler) as Settler;
        settler.work.changePriority(job, newWorkValue);
    }

    getSkillBySettler(idSettler: string, skill: Skill): Ability | null {
        const settler = this.getSettlerById(idSettler);
        if (!settler) return null;
        return settler.skills.abilities.find((e) => e.id === skill) ?? null;
    }
}
