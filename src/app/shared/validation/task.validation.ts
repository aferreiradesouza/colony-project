import { BaseBusiness } from '../business/base.business';
import { Business } from '../business/business';
import { RequerimentsWarning } from '../database/task.database';
import { Items } from '../interface/enums/item.enum';
import { RequerimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Task } from '../model/game/base/building/task.model';

export class TaskValidation {
    constructor() {}

    static requirementsSimpleMeal(task: Task): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        if (!Business.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        const meatRequired = task.getTaskConsumption(Items.Meat)!;
        if (
            !Business.storageBusiness.getItemByType(Items.Meat) ||
            (Business.storageBusiness.getItemByType(Items.Meat) &&
                Business.storageBusiness.getItemByType(Items.Meat)!.amount <
                    meatRequired.amount)
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não há carne suficiente',
            });

        if (errors.length || task.warnings?.length) task.addWarning(errors);
        return errors.length ? errors : null;
    }

    static requirementsCompleteMeal(task: Task): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        if (!Business.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        const meatRequired = task.getTaskConsumption(Items.Meat)!;
        if (
            !Business.storageBusiness.getItemByType(Items.Meat) ||
            (Business.storageBusiness.getItemByType(Items.Meat) &&
                Business.storageBusiness.getItemByType(Items.Meat)!.amount <
                    meatRequired.amount)
        )
            errors.push({
                id: RequerimentsErrors.InsufficientResource,
                message: 'Não há carne suficiente',
            });

        if (errors.length || task.warnings?.length) task.addWarning(errors);
        return errors.length ? errors : null;
    }

    static requirementStorage(task: Task): RequerimentsWarning {
        const errors: RequerimentsWarning = [];
        if (!Business.storageBusiness.hasStorage)
            errors.push({
                id: RequerimentsErrors.NoStorage,
                message: 'Não há armazém disponível',
            });
        if (errors.length || task.warnings?.length) task.addWarning(errors);
        return errors.length ? errors : null;
    }
}
