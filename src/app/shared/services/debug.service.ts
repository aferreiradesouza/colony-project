import { Injectable } from '@angular/core';
import { GET_ALEATORY_NAME } from 'src/app/shared/database/names.database';
import {
    Construction,
    Constructions,
} from '../model/game/base/construction.model';
import { Settler } from '../model/game/settler/settler.model';
import { Skill, Skills } from '../model/game/settler/skill.model';
import { Job, Work } from '../model/game/settler/work.model';
import { BaseBusiness } from '../business/base.business';
import { GameBusiness } from '../business/game.business';
import { SettlersBusiness } from '../business/settlers.business';
import { ConstructionBusiness } from '../business/construction.business';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    constructor(
        private settlerBusiness: SettlersBusiness,
        private constructionsBusiness: ConstructionBusiness,
        private baseBusiness: BaseBusiness,
        private gameBusiness: GameBusiness
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
            .forEach((settler) => this.settlerBusiness.add(settler));
    }

    get default(): Work {
        return new Work({
            workInProgressId: Job.None,
            constructionsId: null,
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
        this.constructionsBusiness.add(
            new Construction({
                type: id,
                status: 'not-started',
            })
        );
    }

    log(): void {
        // eslint-disable-next-line no-console
        console.log(this.gameBusiness.game);
    }
}
