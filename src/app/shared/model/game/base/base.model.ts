import { Construction } from './construction.model';
import { Storage } from './storage.model';

export class Base {
    public constructions: Array<Construction>;
    public storage: Storage;

    constructor(base: {
        constructions: Array<Construction>;
        storage: Storage;
    }) {
        this.constructions = base.constructions;
        this.storage = base.storage;
    }
}
