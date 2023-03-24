import { Settler } from '../settler/settler.model';
import { Job } from '../settler/work.model';
import { Construction } from './construction.model';

export class Base {
    public constructions: Array<Construction>;

    constructor(base: { constructions: Array<Construction> }) {
        this.constructions = base.constructions;
    }

    createConstruction(construction: Construction): void {
        this.constructions.push(construction);
    }

    replaceConstruction(constructions: Construction[]): void {
        this.constructions = constructions;
    }

    getConstructionAssignedTo(settler: Settler): Construction | null {
        return (
            this.constructions.find((e) => e.assignTo?.id === settler.id) ??
            null
        );
    }

    assingSettler(
        settler: Settler,
        construction: Construction,
        job: Job | null
    ): void {
        construction.assignSettler(settler, job!);
    }

    unassignSettler(construction: Construction, settler: Settler | null): void {
        construction.unassignSettler(settler);
    }
}
