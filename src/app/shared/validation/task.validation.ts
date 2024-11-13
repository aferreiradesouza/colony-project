import { Business } from '../business/business';
import { RequirimentsWarning } from '../database/task.database';
import { Items } from '../interface/enums/item.enum';
import { RequirimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Task } from '../model/game/base/building/task.model';

export class TaskValidation {
    constructor() {}

    static validateMeatRequirement(task: Task): RequirimentsWarning {
        let errors: RequirimentsWarning = null;
        const meatRequired = task.getTaskConsumption(Items.Meat);
        if (meatRequired) {
            if (
                !Business.storageBusiness.getItemByType(Items.Meat) ||
                (Business.storageBusiness.getItemByType(Items.Meat) &&
                    Business.storageBusiness.getItemByType(Items.Meat)!.amount <
                        meatRequired.amount)
            ){
                errors = {
                    ...(errors ?? {}),
                    [RequirimentsErrors.InsufficientMeats]: 'Não há carne suficiente',
                };
            }
        }
        return errors;
    }

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

    static requirementsSimpleMeal(task: Task): RequirimentsWarning {
        let errors: RequirimentsWarning = null;
        if (!Business.storageBusiness.hasStorage) {
            // errors.push({
            //     id: RequerimentsErrors.NoStorage,
            //     message: 'Não há armazém disponível',
            // });
            errors = {
                ...(errors ?? {}),
                [RequirimentsErrors.NoStorageAvailable]: 'Não há armazém disponível',
            };
        }
        const meatRequired = task.getTaskConsumption(Items.Meat)!;
        if (
            !Business.storageBusiness.getItemByType(Items.Meat) ||
            (Business.storageBusiness.getItemByType(Items.Meat) &&
                Business.storageBusiness.getItemByType(Items.Meat)!.amount <
                    meatRequired.amount)
        ){
            // errors.push({
            //     id: RequerimentsErrors.InsufficientResource,
            //     message: 'Não há carne suficiente',
            // });
            errors = {
                ...(errors ?? {}),
                [RequirimentsErrors.InsufficientMeats]: 'Não há carne suficiente',
            };
        }

        // if (errors.length || task.warnings?.length) task.addWarning(errors);
        return errors;
    }

    static requirementsCompleteMeal(task: Task): RequirimentsWarning {
        let errors: RequirimentsWarning = null;
        if (!Business.storageBusiness.hasStorage){
            // errors.push({
            //     id: RequerimentsErrors.NoStorage,
            //     message: 'Não há armazém disponível',
            // });
            errors = {
                ...(errors ?? {}),
                [RequirimentsErrors.NoStorageAvailable]: 'Não há armazém disponível',
            };
        }
        const meatRequired = task.getTaskConsumption(Items.Meat)!;
        if (
            !Business.storageBusiness.getItemByType(Items.Meat) ||
            (Business.storageBusiness.getItemByType(Items.Meat) &&
                Business.storageBusiness.getItemByType(Items.Meat)!.amount <
                    meatRequired.amount)
        ){
            // errors.push({
            //     id: RequerimentsErrors.InsufficientResource,
            //     message: 'Não há carne suficiente',
            // });
            errors = {
                ...(errors ?? {}),
                [RequirimentsErrors.InsufficientMeats]: 'Não há carne suficiente',
            };
        }

        // if (errors.length || task.warnings?.length) task.addWarning(errors);
        return errors;
    }
}
