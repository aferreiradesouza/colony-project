import { Job } from 'src/app/shared/interface/enums/job.enum';
import { GET_ALEATORY_PROFESSION } from '../../../../database/profession.database';
import { HelperService } from '../../../../services/helpers.service';
import { Health } from './health.model';
import { Necessity } from './necessity.model';
import { Profession } from './profession.model';
import { Skills } from './skill.model';
import { Work } from './work.model';
import { Inventory } from './inventory.model';

interface ISettler {
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

    constructor(settler: ISettler) {
        const profession = GET_ALEATORY_PROFESSION();

        this.id = settler.id ?? HelperService.guid;
        this.age = settler.age;
        this.firstName = settler.firstName;
        this.lastName = settler.lastName;
        this.inventory = settler.inventory;
        this.skills = settler.skills
            ? new Skills(settler.skills)
            : new Skills({ habilities: [] });
        this.health = settler.health
            ? new Health(settler.health)
            : new Health({ health: 100 });
        this.necessity = settler.necessity
            ? new Necessity(settler.necessity)
            : new Necessity({
                  fun: 100,
                  hungry: 100,
                  rest: 100,
              });
        this.profession = settler.profession
            ? new Profession(settler.profession)
            : new Profession({
                  name: profession.profession,
                  title: profession.title,
              });
        this.work = settler.work
            ? new Work(settler.work)
            : new Work({
                  workInProgressId: Job.None,
                  priorities: [],
                  buildingId: null,
              });
    }

    get completeName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get completeNameWithProfession(): string {
        return `${this.firstName} "${this.profession.title}" ${this.lastName}`;
    }
}
