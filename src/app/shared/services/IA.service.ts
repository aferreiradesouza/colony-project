import { Injectable } from '@angular/core';
import { Construction } from '../model/game/base/construction.model';
import { Settler } from '../model/game/settler/settler.model';
import { Job } from '../model/game/settler/work.model';
import { GameBusiness } from '../business/game.business';
import { BaseBusiness } from '../business/base.business';
import { SettlersBusiness } from '../business/settlers.business';
import { ConstructionBusiness } from '../business/construction.business';

@Injectable({ providedIn: 'root' })
export class IAService {
    constructor(
        private gameService: GameBusiness,
        private baseBusiness: BaseBusiness,
        private constructionBusiness: ConstructionBusiness,
        private settlersBusiness: SettlersBusiness
    ) {}

    public start(): void {
        setInterval(() => {
            // console.log(this.gameService);
            this._checkSettlersPriorities();
        }, 500);
    }

    _checkSettlersPriorities(): void {
        this.settlersBusiness.settlers.forEach((settler) => {
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
                    job === Job.Builder &&
                    !!this._checkStructuresWaitingConstruction()
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this._jobConstruction(settler);
                    break;
                }
                if (
                    job === Job.Kitchen &&
                    !!this._checkStructuresHasKitchen()
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this._jobKitchen(settler);
                    break;
                }
            }
        });
    }

    unassignSettler(settler: Settler): void {
        const construction = this.baseBusiness.getConstructionAssignedTo(
            settler.id
        );
        this.baseBusiness.unassignSettler(construction!.id, settler.id);
    }

    _checkStructuresWaitingConstruction(): Construction | null {
        return (
            this.constructionBusiness.constructions.find(
                (e) =>
                    e.status !== 'done' &&
                    !e.assignedTo &&
                    e.jobToCreateStructure === Job.Builder
            ) ?? null
        );
    }

    _jobConstruction(settler: Settler): void {
        const construction = this._checkStructuresWaitingConstruction();
        console.log(construction);
        this.baseBusiness.assingSettler(
            settler.id,
            construction!.id,
            Job.Builder
        );
        // this.constructionBusiness.build(construction!.id);
    }

    _checkStructuresHasKitchen(): Construction | null {
        return (
            this.gameService.game.base.constructions.find(
                (e) =>
                    e.status === 'done' &&
                    !e.assignedTo &&
                    e.jobNecessary === Job.Kitchen
            ) ?? null
        );
    }

    _jobKitchen(settler: Settler): void {
        const construction = this._checkStructuresHasKitchen();
        this.baseBusiness.assingSettler(
            settler.id,
            construction!.id,
            Job.Kitchen
        );
    }
}
