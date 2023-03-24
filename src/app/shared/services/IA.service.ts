import { Injectable } from '@angular/core';
import { Construction } from '../model/base/construction.model';
import { Settler } from '../model/settler/settler.model';
import { Job } from '../model/settler/work.model';
import { GameService } from './game.service';

interface Structure {
    structure: Construction;
    settler: Settler | null;
    job: Job | null;
}

@Injectable({ providedIn: 'root' })
export class IAService {
    constructor(private gameService: GameService) {}

    public start(): void {
        setInterval(() => {
            // this._checkStructures();
            this._checkSettlersPriorities();
        }, 500);
    }

    _checkSettlersPriorities(): void {
        this.gameService.game.settlers.forEach((settler) => {
            const priorities = settler.work.priorities
                .filter((priority) => priority.value && priority.id)
                .sort((a, b) => {
                    return a.weight! >= b.weight! && a.value <= b.value
                        ? -1
                        : 1;
                });
            for (const priority of priorities) {
                const job = priority.id;
                if (job === settler.work.workInProgressId) break;
                if (
                    job === Job.Construction &&
                    !!this._checkStructuresWaitingConstruction()
                ) {
                    if (settler.work.workInProgressId)
                        this.gameService.game.base
                            .getConstructionAssignedTo(settler)
                            ?.unassignSettler(settler);
                    //     settler.work.workInProgress.unassignSettler(settler);
                    this._jobConstruction(settler);
                    break;
                }
                if (
                    job === Job.Kitchen &&
                    !!this._checkStructuresHasKitchen()
                ) {
                    if (settler.work.workInProgressId)
                        this.gameService.game.base
                            .getConstructionAssignedTo(settler)
                            ?.unassignSettler(settler);
                    //     settler.work.workInProgress.unassignSettler(settler);
                    this._jobKitchen(settler);
                    break;
                }
            }
        });
    }

    _checkStructuresWaitingConstruction(): Construction | null {
        return (
            this.gameService.game.base.constructions.find(
                (e) =>
                    e.status !== 'done' &&
                    !e.assignTo &&
                    e.jobToCreateStructure === Job.Construction
            ) ?? null
        );
    }

    _jobConstruction(settler: Settler): void {
        const construction = this._checkStructuresWaitingConstruction();
        this.gameService.game.base.assingSettler(
            settler,
            construction!,
            Job.Construction
        );
        construction?.create();
    }

    _checkStructuresHasKitchen(): Construction | null {
        return (
            this.gameService.game.base.constructions.find(
                (e) =>
                    e.status === 'done' &&
                    !e.assignTo &&
                    e.jobNecessary === Job.Kitchen
            ) ?? null
        );
    }

    _jobKitchen(settler: Settler): void {
        const construction = this._checkStructuresHasKitchen();
        this.gameService.game.base.assingSettler(
            settler,
            construction!,
            Job.Kitchen
        );
    }
}
