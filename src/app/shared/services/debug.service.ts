import { Injectable } from '@angular/core';
import { GET_ALEATORY_NAME } from 'src/app/shared/database/names.database';
import { Settler } from '../model/settler/settler.model';
import { Skill, Skills } from '../model/settler/skill.model';
import { GameService } from './game.service';
import { SettlersService } from './settlers.service';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    constructor(
        private settlerService: SettlersService,
        private gameService: GameService
    ) {}

    createSettlers(num = 1): void {
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
                });
            })
            .forEach((settler) => this.settlerService.add(settler));
    }

    log(): void {
        // eslint-disable-next-line no-console
        console.log(this.gameService.game);
    }
}
