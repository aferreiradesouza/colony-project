import { Injectable } from '@angular/core';
import { Building } from '../model/game/base/building/building.model';
import { Settler } from '../model/game/base/settler/settler.model';
import { GameBusiness } from '../business/game.business';
import { BaseBusiness } from '../business/base.business';
import { SettlersBusiness } from '../business/settlers.business';
import { BuildingBusiness } from '../business/building.business';
import { Job } from '../interface/enums/job.enum';
import { Task } from '../model/game/base/building/task.model';
import { Business } from '../business/business';
import { Priority } from '../model/game/base/settler/work.model';

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
        Business.buildingBusiness.buildings.forEach((building) => {
            if (
                building.status !== 'done' &&
                building.status !== 'building' &&
                building.requirements
            ) {
                const errors = building.requirements(
                    building
                );
                if (errors?.length) building.addWarning(errors);
                else building.clearWarning();
            }
        });
    }

    private checkSettlersPriorities(): void {
        this.settlersBusiness.settlers.forEach((settler) => {
            const priorities = this.sortPriorities(settler.work.priorities);
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
                    !!this.hasStructuresWaitingBuild
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
                    this.job(settler, Job.Kitchen);
                    break;
                }
                if (
                    job === Job.Cut &&
                    !!this.checkStructuresHasJobWithTaskAvaible(Job.Cut)
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this.job(settler, Job.Cut);
                    break;
                }
                if (
                    job === Job.Mining &&
                    !!this.checkStructuresHasJobWithTaskAvaible(Job.Mining)
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this.job(settler, Job.Mining);
                    break;
                }
                if (
                    job === Job.Hunt &&
                    !!this.checkStructuresHasJobWithTaskAvaible(Job.Hunt)
                ) {
                    if (settler.work.workInProgressId)
                        this.unassignSettler(settler);
                    this.job(settler, Job.Hunt);
                    break;
                }
            }
        });
    }

    private sortPriorities(priorities: Priority[]): Priority[] {
        return priorities
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
    }

    private unassignSettler(settler: Settler): void {
        const building = this.baseBusiness.getBuildingAssignedTo(settler.id);
        this.baseBusiness.unassignSettler(building!.id, settler.id);
    }

    private get hasStructuresWaitingBuild(): boolean {
        return Business.buildingBusiness.buildings.some(
                (e) =>
                    e.status !== 'done' &&
                    !e.assignedTo &&
                    e.jobToCreateStructure === Job.Builder
                    // (e.requirements
                    //     ? !e.requirements(this.baseBusiness, e)
                    //     : true)
            );
    }

    private getStructureWaitingBuild(): Building | null {
        return (
            this.buildingBusiness.buildings.find(
                (e) =>
                    e.status !== 'done' &&
                    !e.assignedTo &&
                    e.jobToCreateStructure === Job.Builder
                    // (e.requirements
                    //     ? !e.requirements(this.baseBusiness, e)
                    //     : true)
            ) ?? null
        );
    }

    private jobBuilding(settler: Settler): void {
        const building = this.getStructureWaitingBuild();
        Business.settlersBusiness.assignWork(settler.id, building!.id, Job.Builder);
        Business.buildingBusiness.assignSettler(settler, building!.id);
    }

    private checkStructuresHasJobWithTaskAvaible(job: Job): Building | null {
        return (
            this.gameService.game.base.buildings.find(
                (e) =>
                    e.status === 'done' &&
                    e.tasks.filter(
                        (task) =>
                            !task.assignedTo &&
                            task.available &&
                            (task.requirements
                                ? !task.requirements(task)
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

    job(settler: Settler, job: Job): void {
        const building = this.checkStructuresHasJobWithTaskAvaible(
            job
        ) as Building;
        const task = this.getAvailableTask(building);
        this.baseBusiness.assingSettler(
            settler.id,
            building!.id,
            job,
            task.id,
            task.guid
        );
    }

    // private jobKitchen(settler: Settler): void {
    //     const building = this.checkStructuresHasJobWithTaskAvaible(
    //         Job.Kitchen
    //     ) as Building;
    //     const task = this.getAvailableTask(building);
    //     this.baseBusiness.assingSettler(
    //         settler.id,
    //         building!.id,
    //         Job.Kitchen,
    //         task.id,
    //         task.guid
    //     );
    // }

    // private jobCut(settler: Settler): void {
    //     const building = this.checkStructuresHasJobWithTaskAvaible(
    //         Job.Cut
    //     ) as Building;
    //     const task = this.getAvailableTask(building);
    //     this.baseBusiness.assingSettler(
    //         settler.id,
    //         building!.id,
    //         Job.Cut,
    //         task.id,
    //         task.guid
    //     );
    // }

    // private jobMinning(settler: Settler): void {
    //     const building = this.checkStructuresHasJobWithTaskAvaible(
    //         Job.Mining
    //     ) as Building;
    //     const task = this.getAvailableTask(building);
    //     this.baseBusiness.assingSettler(
    //         settler.id,
    //         building!.id,
    //         Job.Mining,
    //         task.id,
    //         task.guid
    //     );
    // }

    private getAvailableTask(building: Building): Task {
        return building.tasks.find((e) => e.available && !e.assignedTo)!;
    }
}
