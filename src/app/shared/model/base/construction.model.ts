export class Construction {
    id: Constructions;

    constructor(construction: { id: Constructions }) {
        this.id = construction.id;
    }
}

export enum Constructions {
    Redidence,
    Storage,
    Kitchen,
}
