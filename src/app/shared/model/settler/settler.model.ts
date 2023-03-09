import { GET_ALEATORY_PROFESSION } from '../../database/profession.database';
import { HelperService } from '../../services/helpers.service';
import { Health } from './health.model';
import { Necessity } from './necessity.model';
import { Profession } from './profession.model';
import { Skills } from './skill.model';
import { Job, Work } from './work.model';

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

    constructor(settler: ISettler) {
        const profession = GET_ALEATORY_PROFESSION();

        this.id = settler.id ?? HelperService.guid;
        this.age = settler.age;
        this.firstName = settler.firstName;
        this.lastName = settler.lastName;
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
              });
    }

    get completeName() {
        return `${this.firstName} ${this.lastName}`;
    }

    get completeNameWithProfession() {
        return `${this.firstName} "${this.profession.title}" ${this.lastName}`;
    }

    assignWork(job: Job | null): void {
        this.work.workInProgressId = job ?? Job.None;
    }

    getWorkValue(job: Job): number {
        return this.work.priorities.filter((e) => e.id === job)[0].value;
    }

    getWorkWeight(job: Job): number {
        return this.work.priorities.filter((e) => e.id === job)[0].weight!;
    }
}
