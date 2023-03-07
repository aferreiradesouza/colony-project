import { Component } from '@angular/core';
import { Settler } from 'src/app/shared/model/settler/settler.model';
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

    get settlers(): Settler[] {
        return this.settlerService.settlers;
    }

    save() {
        -this.gameService.save();
    }

    load() {
        this.gameService.load();
    }

    log() {
        this.debugService.log();
    }
}
