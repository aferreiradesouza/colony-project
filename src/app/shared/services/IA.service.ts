import { Injectable } from '@angular/core';
import { Building } from '../model/game/base/building/building.model';
import { Settler } from '../model/game/base/settler/settler.model';
import { GameBusiness } from '../business/game.business';
import { BaseBusiness } from '../business/base.business';
import { SettlersBusiness } from '../business/settlers.business';
import { BuildingBusiness } from '../business/building.business';
import { Job } from '../interface/enums/job.enum';
import { Task } from '../model/game/base/building/task.model';

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
            this.checkSettlersPriorities();
        }, 500);
    }

    private checkSettlersPriorities(): void {
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
                    !!this.checkStructuresWaitingBuild()
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this.jobBuilding(settler);
                    break;
                }
                if (
                    job === Job.Kitchen &&
                    !!this.checkStructuresHasKitchenWithTaskAvailable()
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this.jobKitchen(settler);
                    break;
                }
            }
        });
    }

    private unassignSettler(settler: Settler): void {
        const building = this.baseBusiness.getBuildingAssignedTo(settler.id);
        this.baseBusiness.unassignSettler(building!.id, settler.id);
    }

    private checkStructuresWaitingBuild(): Building | null {
        return (
            this.buildingBusiness.buildings.find(
                (e) =>
                    e.status !== 'done' &&
                    !e.assignedTo &&
                    e.jobToCreateStructure === Job.Builder
            ) ?? null
        );
    }

    private jobBuilding(settler: Settler): void {
        const building = this.checkStructuresWaitingBuild();
        this.baseBusiness.assingSettler(settler.id, building!.id, Job.Builder);
    }

    private checkStructuresHasKitchenWithTaskAvailable(): Building | null {
        return (
            this.gameService.game.base.buildings.find(
                (e) =>
                    e.status === 'done' &&
                    e.tasks.filter(
                        (f) =>
                            !f.assignedTo &&
                            f.available &&
                            (f.requirements
                                ? !f.requirements(this.baseBusiness, f)
                                : true)
                    ).length &&
                    e.jobNecessary === Job.Kitchen
            ) ?? null
        );
    }

    private jobKitchen(settler: Settler): void {
        const building =
            this.checkStructuresHasKitchenWithTaskAvailable() as Building;
        const task = this.getAvailableTask(building);
        this.baseBusiness.assingSettler(
            settler.id,
            building!.id,
            Job.Kitchen,
            task.id
        );
    }

    private getAvailableTask(building: Building): Task {
        return building.tasks.find((e) => e.available && !e.assignedTo)!;
    }
}
