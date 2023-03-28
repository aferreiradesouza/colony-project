import { Injectable } from '@angular/core';
import { Settler } from '../model/game/settler/settler.model';
import { Job } from '../model/game/settler/work.model';
import { GameBusiness } from './game.business';

@Injectable({ providedIn: 'root' })
export class SettlersBusiness {
    constructor(private gameService: GameBusiness) {}

    get settlers(): Settler[] {
        return this.gameService.game.settlers;
    }

    public add(settler: Settler): void {
        this.gameService.game.settlers.push(settler);
    }

    public replace(settler: Settler[]): void {
        this.gameService.game.settlers = settler;
    }

    getSettlerById(id: string): Settler | null {
        return this.settlers.find((e) => e.id === id) ?? null;
    }

    assignWork(id: string, idContruction: string, job: Job): void {
        const settler = this.getSettlerById(id) as Settler;
        settler.work.workInProgressId = job;
        settler.work.constructionsId = idContruction;
    }

    unassignWork(id: string): void {
        const settler = this.getSettlerById(id) as Settler;
        settler.work.workInProgressId = Job.None;
        settler.work.constructionsId = null;
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
