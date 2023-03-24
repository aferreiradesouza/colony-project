import { Component } from '@angular/core';
import {
    Construction,
    Constructions,
} from 'src/app/shared/model/game/base/construction.model';
import { BaseService } from 'src/app/shared/services/base.service';
import { DebugService } from 'src/app/shared/services/debug.service';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
    constructor(
        private baseService: BaseService,
        private debugService: DebugService
    ) {}

    get constructions(): Construction[] {
        return this.baseService.contructions;
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
