import { Injectable } from '@angular/core';
import { GET_ALEATORY_NAME } from 'src/app/shared/database/names.database';
import { Settler } from '../model/settler/settler.model';
import { Skill, Skills } from '../model/settler/skill.model';
import { SettlersService } from './settlers.service';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    constructor(private settlerService: SettlersService) {}

    createSettlers(num = 1): void {
        Array(num)
            .fill('')
            .map(() => {
                return new Settler({
                    firstName: GET_ALEATORY_NAME().name,
                    lastName: GET_ALEATORY_NAME().lastname,
                    age: 18,
                    skills: new Skills([{ name: Skill.Shot, level: 9 }]),
                });
            })
            .forEach((settler) => this.settlerService.addSettler(settler));
    }
}
