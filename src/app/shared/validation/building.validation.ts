import { Business } from '../business/business';
import { RequirimentsWarning } from '../database/task.database';
import { Items } from '../interface/enums/item.enum';
import { RequirimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Building } from '../model/game/base/building/building.model';

export class BuildingValidation {
    constructor() {}

    static storage(): RequirimentsWarning {
        let errors: RequirimentsWarning = null;
        if (!Business.storageBusiness.hasStorage){
            errors = {
                ...(errors ?? {}),
                [RequirimentsErrors.NoStorageAvailable]: 'Não há armazém disponível',
            };
        }
        return errors;
    }

    static stone(building: Building): RequirimentsWarning {
        let errors: RequirimentsWarning = null;
        const stone = Business.storageBusiness.getItemByType(Items.Stone);
        const stoneNecessary =
            building.resources.find((e) => e.id === Items.Stone)!.amount -
            (building.getItemInInventory(Items.Stone)?.amount ??
                0);
        if ((!stone && stoneNecessary > 0) || (stone && stone.amount < stoneNecessary)){
            errors = {
                ...(errors ?? {}),
                [RequirimentsErrors.InsufficientStones]: 'Não há pedra suficiente',
            };
        }
        return errors;
    }

    static wood(building: Building): RequirimentsWarning {
        let errors: RequirimentsWarning = null;
        const wood = Business.storageBusiness.getItemByType(Items.Wood);
        const woodNecessary =
            building.resources.find((e) => e.id === Items.Wood)!.amount -
            (building.getItemInInventory(Items.Wood)?.amount ??
                0);
        if ((!wood && woodNecessary > 0) || (wood && wood.amount < woodNecessary)){
            errors = {
                ...(errors ?? {}),
                [RequirimentsErrors.InsufficientWoods]: 'Não há madeira suficiente',
            };
        }
        return errors;
    }
}
