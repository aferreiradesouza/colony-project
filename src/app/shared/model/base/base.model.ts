import { Construction } from './construction.model';

export class Base {
    public constructions: Array<Construction>;

    constructor(base: { constructions: Array<Construction> }) {
        this.constructions = base.constructions;
    }
}
