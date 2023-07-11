import { BaseBusiness } from '../business/base.business';
import { EfficiencyBusiness } from '../business/efficiency.business';
import { Buildings } from '../interface/enums/buildings.enum';
import { Itens } from '../interface/enums/item.enum';
import { RequerimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import { Task } from '../model/game/base/building/task.model';
import { Settler } from '../model/game/base/settler/settler.model';
import { Skill } from '../model/game/base/settler/skill.model';
import { TaskValidation } from '../validation/task.validation';

export interface ITaskDatabase {
    id: Tasks;
    baseTimeMs: number;
    name: string;
    assignedTo: string | null;
    available: boolean;
    buildings: Buildings[];
    mainSkill: Skill;
    consumption: TaskConsumption[];
    resourceGenerated: TaskResourceGenerated[];
    efficiencyFn: (settler: Settler) => number;
    requirements?: (
        baseBusiness: BaseBusiness,
        task: Task
    ) => RequerimentsWarning;
}

export type RequerimentsWarning =
    | { id: RequerimentsErrors; message: string }[]
    | null;
export type TaskConsumption = { id: Itens; amount: number };
export type TaskResourceGenerated = { id: Itens; amount: number };

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
                mainSkill: Skill.Cook,
                efficiencyFn: EfficiencyBusiness.Cook,
                resourceGenerated: [{ id: Itens.RefeicaoSimples, amount: 1 }],
                consumption: [{ id: Itens.Meat, amount: 5 }],
                requirements: TaskValidation.requirementsSimpleMeal,
            },
            [Tasks?.RefeicaoCompleta]: {
                id: Tasks.RefeicaoCompleta,
                buildings: [Buildings.Kitchen],
                name: 'Refeição Completa',
                assignedTo: null,
                baseTimeMs: 4000,
                available: false,
                mainSkill: Skill.Cook,
                efficiencyFn: EfficiencyBusiness.Cook,
                resourceGenerated: [{ id: Itens.RefeicaoCompleta, amount: 1 }],
                consumption: [{ id: Itens.Meat, amount: 10 }],
                requirements: TaskValidation.requirementsSimpleMeal,
            },
            [Tasks?.ObterMadeira]: {
                id: Tasks.ObterMadeira,
                buildings: [Buildings.Camping],
                name: 'Obter madeira',
                assignedTo: null,
                baseTimeMs: 2000,
                available: false,
                mainSkill: Skill.Strong,
                efficiencyFn: EfficiencyBusiness.Strong,
                resourceGenerated: [{ id: Itens.Wood, amount: 10 }],
                consumption: [],
                requirements: TaskValidation.requirementStorage,
            },
            [Tasks?.ObterPedra]: {
                id: Tasks.ObterPedra,
                buildings: [Buildings.Quarry],
                name: 'Obter pedra',
                assignedTo: null,
                baseTimeMs: 2000,
                available: false,
                mainSkill: Skill.Strong,
                efficiencyFn: EfficiencyBusiness.Strong,
                resourceGenerated: [{ id: Itens.Stone, amount: 10 }],
                consumption: [],
                requirements: TaskValidation.requirementStorage,
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
}
