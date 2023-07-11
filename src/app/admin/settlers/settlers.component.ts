import { Component } from '@angular/core';
import { Settler } from 'src/app/shared/model/game/base/settler/settler.model';
import { DebugService } from 'src/app/shared/services/debug.service';
import { GameBusiness } from 'src/app/shared/business/game.business';
import { SettlersBusiness } from 'src/app/shared/business/settlers.business';
import { LogService } from 'src/app/shared/services/log.service';
import { Job } from 'src/app/shared/interface/enums/job.enum';
import { Skills } from 'src/app/shared/model/game/base/settler/skill.model';
import { Skill } from 'src/app/shared/model/game/base/settler/skill.model';

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
        this.debugService.createSettlers(
            1,
            this.debugService.builder,
            new Skills({
                habilities: [{ id: Skill.Building, level: 15 }],
            })
        );
    }

    get settlers(): Settler[] {
        return this.settlerService.settlers;
    }

    save(): void {
        this.gameService.save();
    }

    deleteSave(): void {
        this.gameService.deleteSave();
    }

    // load(): void {
    //     this.gameService.load();
    // }

    log(): void {
        // eslint-disable-next-line no-console
        console.log(LogService.log);
        this.debugService.log();
    }

    addWorstCook(): void {
        this.debugService.createSettlers(
            1,
            this.debugService.cook,
            new Skills({
                habilities: [{ id: Skill.Cook, level: 2 }],
            })
        );
    }

    changeWorkValue(newWorkValue: number, idSettler: string, job: Job): void {
        this.settlerService.changeWorkValue(idSettler, newWorkValue, job);
    }
}
