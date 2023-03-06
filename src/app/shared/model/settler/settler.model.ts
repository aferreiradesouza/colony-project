import { GET_ALEATORY_PROFESSION } from '../../database/profession.database';
import { HelperService } from '../../services/helpers.service';
import { Health } from './health.model';
import { Necessity } from './necessity.model';
import { Profession } from './profession.model';
import { Skills } from './skill.model';
import { Job, Work } from './work.model';

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

    constructor(settler: {
        id?: string;
        age: number;
        firstName: string;
        lastName: string;
        skills: Skills;
        health?: Health;
        necessity?: Necessity;
        profession?: Profession;
        work?: Work;
    }) {
        const profession = GET_ALEATORY_PROFESSION();

        this.id = settler.id ?? HelperService.createGuid();
        this.age = settler.age;
        this.firstName = settler.firstName;
        this.lastName = settler.lastName;
        this.skills = settler.skills ?? [];
        this.health = settler.health ?? new Health(100);
        this.necessity = settler.necessity ?? new Necessity(100, 100, 100);
        this.profession =
            settler.profession ??
            new Profession({
                name: profession.profissao,
                title: profession.titulo,
            });
        this.work =
            settler.work ??
            new Work({
                id: Job.None,
                name: 'Nenhum',
            });
    }

    get completeName() {
        return `${this.firstName} ${this.lastName}`;
    }

    get completeNameWithProfession() {
        return `${this.firstName} "${this.profession.title}" ${this.lastName}`;
    }
}
