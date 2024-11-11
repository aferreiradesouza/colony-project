import { BaseBusiness } from '../business/base.business';
import { Business } from '../business/business';
import { BuildingDatabase } from '../database/building.database';
import { RequerimentsWarning } from '../database/task.database';
import { Buildings } from '../interface/enums/buildings.enum';
import { Items } from '../interface/enums/item.enum';
import { RequerimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Building } from '../model/game/base/building/building.model';

export class BuildingValidation {
    constructor() {}

    static requirementsStorage(
        building: Building
    ): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        const storage = BuildingDatabase.getBuildingById(Buildings.Storage);

        if (!storage.resources || building.status === 'paused') return null;

        if (!Business.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        if (!Business.storageBusiness.getItemByType(Items.Stone))
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem pedra',
            });
        if (
            Business.storageBusiness.getItemByType(Items.Stone) &&
            Business.storageBusiness.getItemByType(Items.Stone)!.amount <
                storage.resources.find((e) => e.id === Items.Stone)!.amount!
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem pedra suficiente',
            });

        return errors.length ? errors : null;
    }

    static requirementsHouse(
        building: Building
    ): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        const house = BuildingDatabase.getBuildingById(Buildings.House);

        if (!house.resources) return null;

        const woodNecessary =
            house.resources.find((e) => e.id === Items.Wood)!.amount -
            (building.inventory.find((e) => e.type === Items.Wood)?.amount ??
                0);
        const stoneNecessary =
            house.resources.find((e) => e.id === Items.Stone)!.amount -
            (building.inventory.find((e) => e.type === Items.Stone)?.amount ??
                0);

        if (!Business.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        if (
            !Business.storageBusiness.getItemByType(Items.Wood) &&
            woodNecessary > 0
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem madeira',
            });
        if (
            !Business.storageBusiness.getItemByType(Items.Stone) &&
            stoneNecessary > 0
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem pedra',
            });
        if (
            Business.storageBusiness.getItemByType(Items.Wood) &&
            Business.storageBusiness.getItemByType(Items.Wood)!.amount <
                woodNecessary
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem madeira suficiente',
            });
        if (
            Business.storageBusiness.getItemByType(Items.Stone) &&
            Business.storageBusiness.getItemByType(Items.Stone)!.amount <
                stoneNecessary
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem pedra suficiente',
            });

        return errors.length ? errors : null;
    }
}
