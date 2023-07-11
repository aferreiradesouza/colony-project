import { BaseBusiness } from '../business/base.business';
import { RequerimentsWarning } from '../database/task.database';
import { Itens } from '../interface/enums/item.enum';
import { RequerimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Task } from '../model/game/base/building/task.model';

export class TaskValidation {
    constructor() {}

    static requirementsSimpleMeal(
        baseBusiness: BaseBusiness,
        task: Task
    ): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        if (!baseBusiness.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        if (
            !baseBusiness.storageBusiness.getItemByType(Itens.Meat) ||
            (baseBusiness.storageBusiness.getItemByType(Itens.Meat) &&
                baseBusiness.storageBusiness.getItemByType(Itens.Meat)!.amount <
                    5)
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não há carne suficiente',
            });

        if (errors.length || task.warnings?.length) task.addWarning(errors);
        return errors.length ? errors : null;
    }

    static requirementStorage(
        baseBusiness: BaseBusiness,
        task: Task
    ): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        if (!baseBusiness.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        if (errors.length || task.warnings?.length) task.addWarning(errors);
        return errors.length ? errors : null;
    }
}
