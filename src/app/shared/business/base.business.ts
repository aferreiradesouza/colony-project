import { Injectable } from '@angular/core';
import { Construction } from '../model/game/base/construction.model';
import { Settler } from '../model/game/settler/settler.model';
import { Job } from '../model/game/settler/work.model';
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
            this.settlersBusiness.unassignWork(event.idSettler);
        });
    }

    private _startOnWorkAtStructure(): void {
        this.constructionBusiness.onWorkAtStructure.subscribe((event) => {
            console.log(event);
        });
    }
}
