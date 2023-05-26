import { BaseBusiness } from '../business/base.business';
import { BuildingDatabase } from '../database/building.database';
import { RequerimentsWarning } from '../database/task.database';
import { Buildings } from '../interface/enums/buildings.enum';
import { Itens } from '../interface/enums/item.enum';
import { RequerimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Building } from '../model/game/base/building/building.model';

export class BuildingValidation {
    constructor() {}

    static requirementsStorage(
        baseBusiness: BaseBusiness,
        building: Building
    ): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        const storage = BuildingDatabase.getBuildingById(Buildings.Storage);

        if (!storage.resources || building.status === 'paused') return null;

        if (!baseBusiness.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        if (!baseBusiness.storageBusiness.getItemByType(Itens.Stone))
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem pedra',
            });
        if (
            baseBusiness.storageBusiness.getItemByType(Itens.Stone) &&
            baseBusiness.storageBusiness.getItemByType(Itens.Stone)!.amount <
                storage.resources.find((e) => e.id === Itens.Stone)!.amount!
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem pedra suficiente',
            });

        return errors.length ? errors : null;
    }

    static requirementsHouse(
        baseBusiness: BaseBusiness,
        building: Building
    ): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        const house = BuildingDatabase.getBuildingById(Buildings.House);

        if (!house.resources || building.status === 'paused') return null;

        if (!baseBusiness.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        if (!baseBusiness.storageBusiness.getItemByType(Itens.Wood))
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem madeira',
            });
        if (
            baseBusiness.storageBusiness.getItemByType(Itens.Wood) &&
            baseBusiness.storageBusiness.getItemByType(Itens.Wood)!.amount <
                house.resources.find((e) => e.id === Itens.Wood)!.amount!
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não tem madeira suficiente',
            });

        return errors.length ? errors : null;
    }
}
