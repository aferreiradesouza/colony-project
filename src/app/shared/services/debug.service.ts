import { Injectable } from '@angular/core';
import { GET_ALEATORY_NAME } from 'src/app/shared/database/names.database';
import {
    Construction,
    Constructions,
} from '../model/game/base/construction.model';
import { Settler } from '../model/game/settler/settler.model';
import { Skill, Skills } from '../model/game/settler/skill.model';
import { Job, Work } from '../model/game/settler/work.model';
import { BaseService } from './base.service';
import { GameService } from './game.service';
import { SettlersService } from './settlers.service';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    constructor(
        private settlerService: SettlersService,
        private baseService: BaseService,
        private gameService: GameService
    ) {}

    createSettlers(num = 1, work: Work = this.default): void {
        Array(num)
            .fill('')
            .map(() => {
                return new Settler({
                    firstName: GET_ALEATORY_NAME().name,
                    lastName: GET_ALEATORY_NAME().lastname,
                    age: 18,
                    skills: new Skills({
                        habilities: [
                            { id: Skill.Shot, level: 9 },
                            { id: Skill.Animals, level: null },
                        ],
                    }),
                    work,
                });
            })
            .forEach((settler) => this.settlerService.add(settler));
    }

    get default(): Work {
        return new Work({
            workInProgressId: Job.None,
            priorities: [
                {
                    id: Job.Builder,
                    value: 1,
                },
                {
                    id: Job.Kitchen,
                    value: 1,
                },
            ],
        });
    }

    get cook(): Work {
        return new Work({
            workInProgressId: Job.None,
            priorities: [
                {
                    id: Job.Builder,
                    value: 0,
                },
                {
                    id: Job.Kitchen,
                    value: 1,
                },
            ],
        });
    }

    get builder(): Work {
        return new Work({
            workInProgressId: Job.None,
            priorities: [
                {
                    id: Job.Builder,
                    value: 1,
                },
                {
                    id: Job.Kitchen,
                    value: 0,
                },
            ],
        });
    }

    createConstruction(id: Constructions): void {
        this.baseService.addContruction(
            new Construction({
                type: id,
                status: 'not-started',
            })
        );
    }

    log(): void {
        // eslint-disable-next-line no-console
        console.log(this.gameService.game);
    }
}
