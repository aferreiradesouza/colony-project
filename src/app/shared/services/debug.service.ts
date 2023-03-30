import { Injectable } from '@angular/core';
import { GET_ALEATORY_NAME } from 'src/app/shared/database/names.database';
import { Building } from '../model/game/base/building/building.model';
import { Settler } from '../model/game/base/settler/settler.model';
import { Skill, Skills } from '../model/game/base/settler/skill.model';
import { Work } from '../model/game/base/settler/work.model';
import { GameBusiness } from '../business/game.business';
import { SettlersBusiness } from '../business/settlers.business';
import { BuildingBusiness } from '../business/building.business';
import { StorageBusiness } from '../business/storage.business';
import { Storage } from '../model/game/base/building/storage/storage.model';
import { Buildings } from '../interface/enums/buildings.enum';
import { Job } from '../interface/enums/job.enum';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    constructor(
        private settlerBusiness: SettlersBusiness,
        private buildingBusiness: BuildingBusiness,
        private storageBusiness: StorageBusiness,
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
            buildingId: null,
            priorities: [
                {
                    id: Job.Builder,
                    value: 1,
                },
                {
                    id: Job.Agriculture,
                    value: 3,
                },
                {
                    id: Job.Kitchen,
                    value: 2,
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

    createStorage(): void {
        this.storageBusiness.buildStorage(new Storage({ inventory: [] }));
    }

    createBuilding(id: Buildings): void {
        this.buildingBusiness.add(
            new Building({
                type: id,
                status: 'not-started',
            })
        );
    }

    createReadyBuilding(id: Buildings): void {
        this.buildingBusiness.add(
            new Building({
                type: id,
                status: 'done',
            })
        );
    }

    log(): void {
        // eslint-disable-next-line no-console
        console.log(this.gameBusiness.game);
    }
}
