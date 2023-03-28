import { Component } from '@angular/core';
import { Settler } from 'src/app/shared/model/game/settler/settler.model';
import { DebugService } from 'src/app/shared/services/debug.service';
import { GameBusiness } from 'src/app/shared/business/game.business';
import { SettlersBusiness } from 'src/app/shared/business/settlers.business';

@Component({
    selector: 'app-settlers',
    templateUrl: './settlers.component.html',
    styleUrls: ['./settlers.component.scss'],
})
export class SettlersComponent {
    constructor(
        private debugService: DebugService,
        private settlerService: SettlersBusiness,
        private gameService: GameBusiness
    ) {}

    addSettler(): void {
        this.debugService.createSettlers(1);
    }

    addCook(): void {
        this.debugService.createSettlers(1, this.debugService.cook);
    }

    addBuilder(): void {
        this.debugService.createSettlers(1, this.debugService.builder);
    }

    get settlers(): Settler[] {
        return this.settlerService.settlers;
    }

    save(): void {
        this.gameService.save();
    }

    load(): void {
        this.gameService.load();
    }

    log(): void {
        this.debugService.log();
    }
}
