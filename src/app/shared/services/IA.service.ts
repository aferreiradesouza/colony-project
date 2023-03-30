import { Injectable } from '@angular/core';
import { Building } from '../model/game/base/building/building.model';
import { Settler } from '../model/game/base/settler/settler.model';
import { GameBusiness } from '../business/game.business';
import { BaseBusiness } from '../business/base.business';
import { SettlersBusiness } from '../business/settlers.business';
import { BuildingBusiness } from '../business/building.business';
import { Job } from '../interface/enums/job.enum';

@Injectable({ providedIn: 'root' })
export class IAService {
    constructor(
        private gameService: GameBusiness,
        private baseBusiness: BaseBusiness,
        private buildingBusiness: BuildingBusiness,
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
                    if (a.value < b.value && a.weight! >= b.weight!) return -3;
                    else if (a.value < b.value && a.weight! <= b.weight!)
                        return -2;
                    else if (a.value === b.value && a.weight! >= b.weight!)
                        return -1;
                    else if (a.value === b.value && a.weight! === b.weight!)
                        return 0;
                    else if (a.value >= b.value && a.weight! <= b.weight!)
                        return 1;
                    else if (a.value >= b.value && a.weight! >= b.weight!)
                        return 2;
                    else return 3;
                });
            for (const priority of priorities) {
                const job = priority.id;
                if (job === settler.work.workInProgressId) break;
                if (
                    job === Job.Builder &&
                    !!this._checkStructuresWaitingBuild()
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this._jobBuilding(settler);
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
        const building = this.baseBusiness.getBuildingAssignedTo(settler.id);
        this.baseBusiness.unassignSettler(building!.id, settler.id);
    }

    _checkStructuresWaitingBuild(): Building | null {
        return (
            this.buildingBusiness.buildings.find(
                (e) =>
                    e.status !== 'done' &&
                    !e.assignedTo &&
                    e.jobToCreateStructure === Job.Builder
            ) ?? null
        );
    }

    _jobBuilding(settler: Settler): void {
        const building = this._checkStructuresWaitingBuild();
        this.baseBusiness.assingSettler(settler.id, building!.id, Job.Builder);
    }

    _checkStructuresHasKitchen(): Building | null {
        return (
            this.gameService.game.base.buildings.find(
                (e) =>
                    e.status === 'done' &&
                    !e.assignedTo &&
                    e.jobNecessary === Job.Kitchen
            ) ?? null
        );
    }

    _jobKitchen(settler: Settler): void {
        const building = this._checkStructuresHasKitchen();
        this.baseBusiness.assingSettler(settler.id, building!.id, Job.Kitchen);
    }
}
