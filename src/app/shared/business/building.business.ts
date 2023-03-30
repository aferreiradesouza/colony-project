import { EventEmitter, Injectable } from '@angular/core';
import { BuildingDatabase } from '../database/building.database';
import { Job } from '../interface/enums/job.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import {
    Building,
    BuildingStatus,
} from '../model/game/base/building/building.model';
import { Task } from '../model/game/base/building/task.model';
import { NotificationService } from '../services/notification.service';
import { GameBusiness } from './game.business';

@Injectable({ providedIn: 'root' })
export class BuildingBusiness {
    public onDoneBuilding = new EventEmitter<{
        id: string;
        idSettler: string;
    }>();

    public onChangeStatus = new EventEmitter<{
        id: string;
        status: BuildingStatus;
    }>();

    public onWorkAtStructure = new EventEmitter<{
        job: Job;
    }>();

    constructor(
        private gameService: GameBusiness,
        private notificationService: NotificationService
    ) {}

    get buildings(): Building[] {
        const buildings = [...this.gameService.game.base.buildings];
        if (this.gameService.game.base.storage)
            buildings.push(this.gameService.game.base.storage);
        return buildings;
    }

    add(data: Building): void {
        this.gameService.game.base.buildings.push(data);
    }

    setBuilding(building: Building[]): void {
        this.gameService.game.base.buildings = building;
    }

    getBuildingById(id: string): Building | null {
        return this.buildings.find((e) => e.id === id) ?? null;
    }

    getBuildingBySettler(id: string): Building | null {
        return this.buildings.find((e) => e.assignedTo === id) ?? null;
    }

    getBuildingByTaskAssignedToSettler(idSettler: string): Building | null {
        return (
            this.buildings.find((e) =>
                e.tasks.find((f) => f.assignedTo === idSettler)
            ) ?? null
        );
    }

    getTaskBuildingBySettler(
        building: Building,
        idSettler: string
    ): Task | null {
        return building.tasks.find((e) => e.assignedTo === idSettler) ?? null;
    }

    assignSettler(idSettler: string, idContruction: string): void {
        const building = this.getBuildingById(idContruction) as Building;
        building.assignedTo = idSettler;
        if (building.status === 'not-started') this.build(building.id);
        if (building.status === 'paused') this.resume(idContruction);
    }

    build(id: string): void {
        const building = this.getBuildingById(id) as Building;
        this.changeStatus(id, 'building');
        building.interval = setInterval(() => {
            building.timeMs -= 1000;
            building.percent = this._calculatePercent(building);
            if (building.timeMs <= 0) this.done(id);
        }, 1000);
    }

    resume(id: string): void {
        this.build(id);
    }

    stop(id: string): void {
        const building = this.getBuildingById(id) as Building;
        if (building.status !== 'done') this.changeStatus(id, 'paused');
    }

    done(id: string): void {
        const building = this.getBuildingById(id) as Building;
        this.onDoneBuilding.emit({
            id,
            idSettler: building.assignedTo!,
        });
        clearInterval(building.interval);
        this.changeStatus(id, 'done');
        this.unassignSettler(id);
        this.notificationService.buildingSuccess({
            title: BuildingDatabase.getBuildingById(building.type).name,
        });
    }

    changeStatus(id: string, status: BuildingStatus): void {
        const building = this.getBuildingById(id) as Building;
        building.status = status;
        this.onChangeStatus.emit({ id, status: building.status });
    }

    private _calculatePercent(building: Building): number {
        const fullTime = BuildingDatabase.getBuildingById(building.type).timeMs;
        return Number((100 - (100 * building.timeMs) / fullTime).toFixed(2));
    }

    unassignSettler(idContruction: string): void {
        const building = this.getBuildingById(idContruction) as Building;
        building.assignedTo = null;
        if (building.status === 'building') this.stop(idContruction);
        clearInterval(building.interval);
    }

    unassignSettlerAtDoneBuilding(idContruction: string, task: Tasks): void {
        const building = this.getBuildingById(idContruction) as Building;
        building.assignedTo = null;
        const taskBuilding = this.getTaskByBuilding(building, task);
        taskBuilding.assignedTo = null;
        clearInterval(taskBuilding.interval);
    }

    work(idSettler: string, idBuilding: string, task: Tasks): void {
        const building = this.getBuildingById(idBuilding) as Building;
        const taskBuilding = this.getTaskByBuilding(building, task);
        taskBuilding.assignedTo = idSettler;
        const config = BuildingDatabase.getTaskBuildingById(
            building.type,
            taskBuilding.id
        );
        if (!config) return;
        taskBuilding.interval = setInterval(() => {
            this.onWorkAtStructure.emit({ job: building.jobNecessary! });
        }, config.baseTimeMs);
    }

    getTaskByBuilding(building: Building, task: Tasks): Task {
        return building.tasks.find((e) => e.id === task)!;
    }

    disableTaskOfBuilding(task: Task): void {
        task.available = false;
        task.assignedTo = null;
        clearInterval(task.interval);
    }

    enableTaskOfBuilding(task: Task): void {
        task.available = true;
    }
}
