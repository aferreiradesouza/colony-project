import { GET_ALEATORY_PROFESSION, ProfessionConstant } from 'src/app/shared/database/profession.database';
import { HelperService } from '../../../../services/helpers.service';
import { Health } from './health.model';
import { Necessity } from './necessity.model';
import { Profession } from './profession.model';
import { Skills } from './skill.model';
import { Work } from './work.model';
import { Inventory } from './inventory.model';

interface SettlerData {
    id?: string;
    age: number;
    firstName: string;
    lastName: string;
    skills: Skills;
    health?: Health;
    necessity?: Necessity;
    profession?: Profession;
    work?: Work;
    inventory: Inventory;
}

export class Settler {
    public id: string;
    public firstName: string;
    public lastName: string;
    public age: number;
    public skills: Skills;
    public health: Health;
    public necessity: Necessity;
    public profession: Profession;
    public work: Work;
    public inventory: Inventory;

    constructor(settler: SettlerData) {
        const profession = GET_ALEATORY_PROFESSION();

        this.id = settler.id ?? HelperService.guid;
        this.age = settler.age;
        this.firstName = settler.firstName;
        this.lastName = settler.lastName;
        this.inventory = this.initializeInventory(settler);
        this.skills = this.initializeSkills(settler);
        this.health = this.initializeHealth(settler);
        this.necessity = this.initializeNecessity(settler);
        this.profession = this.initializeProfession(settler, profession);
        this.work = this.initializeWork(settler);
    }

    /**
     * Initializes the inventory of the settler.
     * @param settler - The data to initialize the inventory with.
     * @returns The initialized inventory.
     */
    private initializeInventory(settler: SettlerData): Inventory {
        return settler.inventory instanceof Inventory ? settler.inventory : new Inventory([]);
    }

    /**
     * Initializes the skills of the settler.
     * @param settler - The data to initialize the skills with.
     * @returns The initialized skills.
     */
    private initializeSkills(settler: SettlerData): Skills {
        return settler.skills instanceof Skills ? settler.skills : new Skills({
            abilities: []
        });
    }

    /**
     * Initializes the health of the settler.
     * @param settler - The data to initialize the health with.
     * @returns The initialized health.
     */
    private initializeHealth(settler: SettlerData): Health {
        return settler.health instanceof Health ? settler.health : new Health({
            health: 100
        });
    }

    /**
     * Initializes the profession of the settler.
     * @param settler - The data to initialize the profession with.
     * @param profession - The profession constant to use if none is provided.
     * @returns The initialized profession.
     */
    private initializeProfession(settler: SettlerData, profession: ProfessionConstant): Profession {
        return settler.profession instanceof Profession ? settler.profession : new Profession({
            name: profession.name,
            title: profession.title,
        });
    }

    /**
     * Initializes the work of the settler.
     * @param settler - The data to initialize the work with.
     * @returns The initialized work.
     */
    private initializeWork(settler: SettlerData): Work {
        return settler.work instanceof Work ? settler.work : new Work({
            priorities: [],
            buildingId: null
        });
    }

    /**
     * Initializes the necessity of the settler.
     * @param settler - The data to initialize the necessity with.
     * @returns The initialized necessity.
     */
    private initializeNecessity(settler: SettlerData): Necessity {
        return settler.necessity instanceof Necessity ? settler.necessity : new Necessity({
            fun: 100,
            hunger: 100,
            rest: 100,
        });
    }

    /**
     * Gets the complete name of the settler.
     * @returns The complete name of the settler.
     */
    get completeName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * Gets the complete name of the settler with their profession title.
     * @returns The complete name of the settler with their profession title.
     */
    get completeNameWithProfession(): string {
        return `${this.firstName} "${this.profession.title}" ${this.lastName}`;
    }
}
