import { BaseBusiness } from './base.business';
import { BiomesBusiness } from './biomes.business';
import { BuildingBusiness } from './building.business';
import { GameBusiness } from './game.business';
import { SettlersBusiness } from './settlers.business';
import { StorageBusiness } from './storage.business';
import { TaskBusiness } from './task.business';

export class Business {
    static gameBusiness: GameBusiness;
    static taskBusiness: TaskBusiness;
    static baseBusiness: BaseBusiness;
    static settlersBusiness: SettlersBusiness;
    static buildingBusiness: BuildingBusiness;
    static storageBusiness: StorageBusiness;
    static biomesBusiness: BiomesBusiness;
}
