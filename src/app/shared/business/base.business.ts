import { Injectable } from '@angular/core';
import { Construction } from '../model/game/base/construction.model';
import { Job } from '../model/game/settler/work.model';
import { LogService } from '../services/log.service';
import { ConstructionBusiness } from './construction.business';
import { SettlersBusiness } from './settlers.business';

@Injectable({ providedIn: 'root' })
export class BaseBusiness {
    constructor(
        private constructionBusiness: ConstructionBusiness,
        private settlersBusiness: SettlersBusiness
    ) {
        this._startEvents();
    }

    getConstructionAssignedTo(idSettler: string): Construction | null {
        return this.constructionBusiness.getConstructionBySettler(idSettler);
    }

    assingSettler(
        idSettler: string,
        idConstruction: string,
        job: Job | null
    ): void {
        this.constructionBusiness.assignSettler(idSettler, idConstruction);
        this.settlersBusiness.assignWork(
            idSettler,
            idConstruction,
            job ?? Job.None
        );
    }

    unassignSettler(idConstruction: string, idSettler: string): void {
        this.constructionBusiness.unassignSettler(idConstruction);
        this.settlersBusiness.unassignWork(idSettler);
    }

    private _startEvents(): void {
        this._startOnDoneConstruction();
        this._startOnWorkAtStructure();
    }

    private _startOnDoneConstruction(): void {
        this.constructionBusiness.onDoneConstruction.subscribe((event) => {
            LogService.add('Construção finalizada');
            this.settlersBusiness.unassignWork(event.idSettler);
        });
    }

    private _startOnWorkAtStructure(): void {
        this.constructionBusiness.onWorkAtStructure.subscribe((event) => {
            LogService.add(`Trabalhou no job: ${event.job}`);
        });
    }
}
