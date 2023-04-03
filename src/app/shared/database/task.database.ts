import { BaseBusiness } from '../business/base.business';
import { Buildings } from '../interface/enums/buildings.enum';
import { Itens } from '../interface/enums/item.enum';
import { RequerimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import { Task } from '../model/game/base/building/task.model';

export interface ITaskDatabase {
    id: Tasks;
    baseTimeMs: number;
    name: string;
    assignedTo: string | null;
    available: boolean;
    buildings: Buildings[];
    consumption: TaskConsumption;
    requirements?: (baseBusiness: BaseBusiness, task: Task) => TaskWarning;
}

export type TaskWarning = { id: RequerimentsErrors; message: string }[] | null;
export type TaskConsumption = { id: Itens; amount: number }[];

export class TaskDatabase {
    constructor() {}

    static get tasks(): { [key in Tasks]: ITaskDatabase } {
        return {
            [Tasks?.RefeicaoSimples]: {
                id: Tasks.RefeicaoSimples,
                buildings: [Buildings.Kitchen],
                name: 'Refeição Simples',
                assignedTo: null,
                baseTimeMs: 2000,
                available: false,
                consumption: [{ id: Itens.Meat, amount: 5 }],
                requirements: TaskDatabase.requirementsSimpleMeal,
            },
            [Tasks?.RefeicaoCompleta]: {
                id: Tasks.RefeicaoCompleta,
                buildings: [Buildings.Kitchen],
                name: 'Refeição Completa',
                assignedTo: null,
                baseTimeMs: 4000,
                available: false,
                consumption: [{ id: Itens.Meat, amount: 10 }],
                requirements: TaskDatabase.requirementsSimpleMeal,
            },
        };
    }

    static get taskList(): ITaskDatabase[] {
        return Object.values(TaskDatabase.tasks);
    }

    static getTaskById(id: Tasks): ITaskDatabase {
        return TaskDatabase.tasks[id];
    }

    static getTaskBuildingById(
        id: Buildings,
        idTask: Tasks
    ): ITaskDatabase | null {
        return (
            TaskDatabase.taskList.filter(
                (e) => e.id === idTask && e.buildings.find((f) => f === id)
            )[0] ?? null
        );
    }

    static requirementsSimpleMeal(
        baseBusiness: BaseBusiness,
        task: Task
    ): TaskWarning {
        const errors: TaskWarning = [];
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
                id: RequerimentsErrors.InsufficientMaterial,
                message: 'Não há carne suficiente',
            });

        if (errors.length || task.warnings?.length)
            baseBusiness.addWarningTask(task, errors);
        return errors.length ? errors : null;
    }
}
