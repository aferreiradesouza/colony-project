import { Component } from '@angular/core';
import {
    Construction,
    Constructions,
} from 'src/app/shared/model/game/base/construction.model';
import { DebugService } from 'src/app/shared/services/debug.service';
import { ConstructionBusiness } from 'src/app/shared/business/construction.business';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
    constructor(
        private constructionBusiness: ConstructionBusiness,
        private debugService: DebugService
    ) {}

    get constructions(): Construction[] {
        return this.constructionBusiness.constructions;
    }

    createStorage(): void {
        this.debugService.createConstruction(Constructions.Storage);
    }
    createHouse(): void {
        this.debugService.createConstruction(Constructions.House);
    }
    createKitchen(): void {
        this.debugService.createConstruction(Constructions.Kitchen);
    }
}
