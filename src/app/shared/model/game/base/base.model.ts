import { Settler } from './settler/settler.model';
import { Building } from './building/building.model';
import { Storage } from './building/storage/storage.model';

export class Base {
    public buildings: Array<Building>;
    public storage: Storage | null;
    public settlers: Settler[];

    constructor(base: {
        buildings: Array<Building>;
        settlers: Settler[];
        storage: Storage | null;
    }) {
        this.settlers = base.settlers.map((e) => new Settler(e));
        this.buildings = base.buildings.map(
            (e) =>
                new Building({
                    type: e.type,
                    id: e.id,
                    status: e.status,
                    assignedTo: e.assignedTo,
                    timeMs: e.timeMs,
                })
        );
        this.storage = base.storage
            ? new Storage({
                  inventory: base.storage.inventory,
                  building: base.storage,
              })
            : null;
    }
}
