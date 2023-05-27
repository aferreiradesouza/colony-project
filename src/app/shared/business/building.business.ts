import { EventEmitter, Injectable } from '@angular/core';
import { BuildingDatabase } from '../database/building.database';
import { Tasks } from '../interface/enums/tasks.enum';
import {
    Building,
    BuildingStatus,
} from '../model/game/base/building/building.model';
import { Task } from '../model/game/base/building/task.model';
import { NotificationService } from '../services/notification.service';
import { GameBusiness } from './game.business';
import { TaskDatabase } from '../database/task.database';
import { Itens } from '../interface/enums/item.enum';
import { Settler } from '../model/game/base/settler/settler.model';
import { EfficiencyBusiness } from './efficiency.business';

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

    public onWorkAtStructure = new EventEmitter<Task>();

    public onUseMaterial = new EventEmitter<{ id: Itens; amount: number }[]>();

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
        if (building.status === 'not-started') {
            if (building.resources.length)
                this.onUseMaterial.emit(building.resources);
            this.build(building.id);
        }
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
        building.clearWarning();
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

    unassignSettlerAtDoneBuilding(
        idContruction: string,
        task: Tasks,
        uniqueIdTask: string
    ): void {
        const building = this.getBuildingById(idContruction) as Building;
        building.assignedTo = null;
        const taskBuilding = this.getTaskByBuilding(
            building,
            task,
            uniqueIdTask
        );
        taskBuilding.assignedTo = null;
        clearInterval(taskBuilding.interval);
    }

    work(data: {
        settler: Settler;
        idBuilding: string;
        task: Tasks;
        uniqueIdTask: string;
        canStartTask: (task: Task) => boolean;
    }): void {
        const building = this.getBuildingById(data.idBuilding) as Building;
        const task = this.getTaskByBuilding(
            building,
            data.task,
            data.uniqueIdTask
        );
        task.assignedTo = data.settler.id;
        const efficiency = task.efficiencyFn(task, data.settler);
        const efficiencyCalculated = (task.baseTimeMs * efficiency) / 100;
        const newEfficiency =
            efficiency > EfficiencyBusiness.defaultEfficiency
                ? efficiencyCalculated - task.baseTimeMs
                : task.baseTimeMs - efficiencyCalculated + task.baseTimeMs;
        console.log(newEfficiency);
        task.interval = setInterval(() => {
            if (task.requirements) {
                if (data.canStartTask(task)) {
                    return;
                }
            }
            if (task.consumption.length)
                this.onUseMaterial.emit(task.consumption);
            this.onWorkAtStructure.emit(task);
        }, newEfficiency);
    }

    getTaskByBuilding(
        building: Building,
        task: Tasks,
        uniqueIdTask: string
    ): Task {
        return building.tasks.find(
            (e) => e.id === task && e.guid === uniqueIdTask
        )!;
    }

    disableTaskOfBuilding(task: Task): void {
        task.available = false;
        task.assignedTo = null;
        clearInterval(task.interval);
        task.clearWarning();
    }

    enableTaskOfBuilding(task: Task): void {
        task.available = true;
    }

    addTask(idBuilding: string, tasks: Tasks): void {
        const building = this.getBuildingById(idBuilding);
        const task = TaskDatabase.getTaskById(tasks);
        building?.tasks.push(new Task(task));
    }
}
