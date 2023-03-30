import { Injectable } from '@angular/core';
import { Job } from '../interface/enums/job.enum';
import { Settler } from '../model/game/base/settler/settler.model';
import { GameBusiness } from './game.business';

@Injectable({ providedIn: 'root' })
export class SettlersBusiness {
    constructor(private gameService: GameBusiness) {}

    get settlers(): Settler[] {
        return this.gameService.game.base.settlers;
    }

    public add(settler: Settler): void {
        this.gameService.game.base.settlers.push(settler);
    }

    public replace(settler: Settler[]): void {
        this.gameService.game.base.settlers = settler;
    }

    getSettlerById(id: string): Settler | null {
        return this.settlers.find((e) => e.id === id) ?? null;
    }

    assignWork(id: string, idContruction: string, job: Job): void {
        const settler = this.getSettlerById(id) as Settler;
        settler.work.workInProgressId = job;
        settler.work.buildingId = idContruction;
    }

    unassignWork(id: string): void {
        const settler = this.getSettlerById(id) as Settler;
        settler.work.workInProgressId = Job.None;
        settler.work.buildingId = null;
    }

    getWorkValue(id: string, job: Job): number {
        const settler = this.getSettlerById(id) as Settler;
        return settler.work.priorities.filter((e) => e.id === job)[0].value;
    }

    getWorkWeight(id: string, job: Job): number {
        const settler = this.getSettlerById(id) as Settler;
        return settler.work.priorities.filter((e) => e.id === job)[0].weight!;
    }
}
