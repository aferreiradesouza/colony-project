import { Component } from '@angular/core';
import { Settler } from 'src/app/shared/model/game/settler/settler.model';
import { DebugService } from 'src/app/shared/services/debug.service';
import { GameService } from 'src/app/shared/services/game.service';
import { SettlersService } from 'src/app/shared/services/settlers.service';

@Component({
    selector: 'app-settlers',
    templateUrl: './settlers.component.html',
    styleUrls: ['./settlers.component.scss'],
})
export class SettlersComponent {
    constructor(
        private debugService: DebugService,
        private settlerService: SettlersService,
        private gameService: GameService
    ) {}

    addSettler(): void {
        this.debugService.createSettlers(1);
    }

    addCook(): void {
        this.debugService.createSettlers(1, this.debugService.builder);
    }

    addBuilder(): void {
        this.debugService.createSettlers(1, this.debugService.cook);
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
