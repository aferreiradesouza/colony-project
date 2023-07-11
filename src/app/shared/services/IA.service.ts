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
            this.verifyBuildingsRequeriments();
        }, 500);
    }

    private verifyBuildingsRequeriments(): void {
        this.baseBusiness.buildingBusiness.buildings.forEach((building) => {
            if (
                building.status !== 'done' &&
                building.status !== 'building' &&
                building.requirements
            ) {
                const errors = building.requirements(
                    this.baseBusiness,
                    building
                );
                if (errors?.length) building.addWarning(errors);
                else building.clearWarning();
            }
        });
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

            if (
                settler.work.workInProgressId &&
                !priorities.find((p) => p.id === settler.work.workInProgressId)
            )
                this.unassignSettler(settler);

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
                    !!this.checkStructuresHasJobWithTaskAvaible(Job.Kitchen)
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this.jobKitchen(settler);
                    break;
                }
                if (
                    job === Job.Cut &&
                    !!this.checkStructuresHasJobWithTaskAvaible(Job.Cut)
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this.jobCut(settler);
                    break;
                }
                if (
                    job === Job.Mining &&
                    !!this.checkStructuresHasJobWithTaskAvaible(Job.Mining)
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this.jobMinning(settler);
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
                    e.jobToCreateStructure === Job.Builder &&
                    (e.requirements
                        ? !e.requirements(this.baseBusiness, e)
                        : true)
            ) ?? null
        );
    }

    private jobBuilding(settler: Settler): void {
        const building = this.checkStructuresWaitingBuild();
        this.baseBusiness.assingSettler(settler.id, building!.id, Job.Builder);
    }

    private checkStructuresHasJobWithTaskAvaible(job: Job): Building | null {
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
                    e.jobNecessary === job
            ) ?? null
        );
    }

    // private checkStructuresHasKitchenWithTaskAvailable(): Building | null {
    //     return (
    //         this.gameService.game.base.buildings.find(
    //             (e) =>
    //                 e.status === 'done' &&
    //                 e.tasks.filter(
    //                     (f) =>
    //                         !f.assignedTo &&
    //                         f.available &&
    //                         (f.requirements
    //                             ? !f.requirements(this.baseBusiness, f)
    //                             : true)
    //                 ).length &&
    //                 e.jobNecessary === Job.Kitchen
    //         ) ?? null
    //     );
    // }

    // private checkStructuresHasCutWithTaskAvailable(): Building | null {
    //     return (
    //         this.gameService.game.base.buildings.find(
    //             (e) =>
    //                 e.status === 'done' &&
    //                 e.tasks.filter(
    //                     (f) =>
    //                         !f.assignedTo &&
    //                         f.available &&
    //                         (f.requirements
    //                             ? !f.requirements(this.baseBusiness, f)
    //                             : true)
    //                 ).length &&
    //                 e.jobNecessary === Job.Cut
    //         ) ?? null
    //     );
    // }

    private jobKitchen(settler: Settler): void {
        const building = this.checkStructuresHasJobWithTaskAvaible(
            Job.Kitchen
        ) as Building;
        const task = this.getAvailableTask(building);
        this.baseBusiness.assingSettler(
            settler.id,
            building!.id,
            Job.Kitchen,
            task.id,
            task.guid
        );
    }

    private jobCut(settler: Settler): void {
        const building = this.checkStructuresHasJobWithTaskAvaible(
            Job.Cut
        ) as Building;
        const task = this.getAvailableTask(building);
        this.baseBusiness.assingSettler(
            settler.id,
            building!.id,
            Job.Cut,
            task.id,
            task.guid
        );
    }

    private jobMinning(settler: Settler): void {
        const building = this.checkStructuresHasJobWithTaskAvaible(
            Job.Mining
        ) as Building;
        const task = this.getAvailableTask(building);
        this.baseBusiness.assingSettler(
            settler.id,
            building!.id,
            Job.Mining,
            task.id,
            task.guid
        );
    }

    private getAvailableTask(building: Building): Task {
        return building.tasks.find((e) => e.available && !e.assignedTo)!;
    }
}
