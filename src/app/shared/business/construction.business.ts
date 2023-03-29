import { EventEmitter, Injectable } from '@angular/core';
import { STRUCTURES } from '../constants/construction.constant';
import { ConstructionDatabase } from '../database/constructions.database';
import { NotificationEnum } from '../interface/enums/notification.enum';
import {
    Construction,
    ConstructionStatus,
} from '../model/game/base/construction.model';
import { Job } from '../model/game/settler/work.model';
import { StructurePipe } from '../pipe/structures.pipe';
import { NotificationService } from '../services/notification.service';
import { GameBusiness } from './game.business';

@Injectable({ providedIn: 'root' })
export class ConstructionBusiness {
    public onDoneConstruction = new EventEmitter<{
        id: string;
        idSettler: string;
    }>();

    public onChangeStatus = new EventEmitter<{
        id: string;
        status: ConstructionStatus;
    }>();

    public onWorkAtStructure = new EventEmitter<{
        job: Job;
    }>();

    constructor(
        private gameService: GameBusiness,
        private notificationService: NotificationService
    ) {}

    get constructions(): Construction[] {
        return this.gameService.game.base.constructions;
    }

    add(data: Construction): void {
        this.gameService.game.base.constructions.push(data);
    }

    setConstruction(construction: Construction[]): void {
        this.gameService.game.base.constructions = construction;
    }

    getConstructionById(id: string): Construction | null {
        return this.constructions.find((e) => e.id === id) ?? null;
    }

    getConstructionBySettler(id: string): Construction | null {
        return this.constructions.find((e) => e.assignedTo === id) ?? null;
    }

    assignSettler(idSettler: string, idContruction: string): void {
        const construction = this.getConstructionById(
            idContruction
        ) as Construction;
        construction.assignedTo = idSettler;
        if (construction.status === 'not-started') this.build(construction.id);
        if (construction.status === 'paused') this.resume(idContruction);
        if (construction.status === 'done') this.work(idContruction);
    }

    build(id: string): void {
        const construction = this.getConstructionById(id) as Construction;
        this.changeStatus(id, 'building');
        construction.interval = setInterval(() => {
            construction.timeMs -= 1000;
            construction.percent = this._calculatePercent(construction);
            if (construction.timeMs <= 0) this.done(id);
        }, 1000);
    }

    resume(id: string): void {
        this.build(id);
    }

    stop(id: string): void {
        const construction = this.getConstructionById(id) as Construction;
        if (construction.status !== 'done') this.changeStatus(id, 'paused');
    }

    done(id: string): void {
        const construction = this.getConstructionById(id) as Construction;
        this.onDoneConstruction.emit({
            id,
            idSettler: construction.assignedTo!,
        });
        clearInterval(construction.interval);
        this.changeStatus(id, 'done');
        this.unassignSettler(id);
        this.notificationService.constructionSuccess({
            title: STRUCTURES[construction.type],
        });
    }

    changeStatus(id: string, status: ConstructionStatus): void {
        const construction = this.getConstructionById(id) as Construction;
        construction.status = status;
        this.onChangeStatus.emit({ id, status: construction.status });
    }

    private _calculatePercent(construction: Construction): number {
        const fullTime = ConstructionDatabase.getConstruction(
            construction.type
        ).timeMs;
        return Number(
            (100 - (100 * construction.timeMs) / fullTime).toFixed(2)
        );
    }

    unassignSettler(idContruction: string): void {
        const construction = this.getConstructionById(
            idContruction
        ) as Construction;
        construction.assignedTo = null;
        if (construction.status === 'building') this.stop(idContruction);
        clearInterval(construction.interval);
    }

    work(id: string): void {
        const construction = this.getConstructionById(id) as Construction;
        const config = ConstructionDatabase.getConstruction(construction.type);
        construction.interval = setInterval(() => {
            this.onWorkAtStructure.emit({ job: construction.jobNecessary! });
        }, config.timeForWork);
    }
}
