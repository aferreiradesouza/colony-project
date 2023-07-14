import { BaseBusiness } from '../business/base.business';
import { EfficiencyBusiness } from '../business/efficiency.business';
import { Buildings } from '../interface/enums/buildings.enum';
import { Items } from '../interface/enums/item.enum';
import { RequerimentsErrors } from '../interface/enums/requeriments-errors.enum';
import { Tasks } from '../interface/enums/tasks.enum';
import { Building } from '../model/game/base/building/building.model';
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
export type TaskConsumption = { id: Items; amount: number };
export type TaskResourceGenerated = { id: Items; amount: number };

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
                resourceGenerated: [{ id: Items.RefeicaoSimples, amount: 1 }],
                consumption: [{ id: Items.Meat, amount: 5 }],
                requirements: TaskValidation.requirementsSimpleMeal,
            },
            [Tasks?.RefeicaoCompleta]: {
                id: Tasks.RefeicaoCompleta,
                buildings: [Buildings.Kitchen],
                name: 'Refeição Completa',
                assignedTo: null,
                baseTimeMs: 5000,
                available: false,
                mainSkill: Skill.Cook,
                efficiencyFn: EfficiencyBusiness.Cook,
                resourceGenerated: [{ id: Items.RefeicaoCompleta, amount: 1 }],
                consumption: [{ id: Items.Meat, amount: 10 }],
                requirements: TaskValidation.requirementsCompleteMeal,
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
                resourceGenerated: [{ id: Items.Wood, amount: 10 }],
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
                resourceGenerated: [{ id: Items.Stone, amount: 10 }],
                consumption: [],
                requirements: TaskValidation.requirementStorage,
            },
            [Tasks?.ObterCarne]: {
                id: Tasks.ObterCarne,
                buildings: [Buildings.HunterHouse],
                name: 'Obter carne',
                assignedTo: null,
                baseTimeMs: 3000,
                available: false,
                mainSkill: Skill.Shoot,
                efficiencyFn: EfficiencyBusiness.Shoot,
                resourceGenerated: [{ id: Items.Meat, amount: 7 }],
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
