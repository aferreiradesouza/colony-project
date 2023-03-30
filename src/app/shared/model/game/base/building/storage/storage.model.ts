import { Buildings } from 'src/app/shared/interface/enums/buildings.enum';
import { Building, IBuilding } from '../building.model';
import { Item } from './item.model';

export class Storage extends Building {
    public inventory: Item[];
    public level = 1;
    public maxStorage = 100;

    constructor(data: { inventory: Item[]; building?: IBuilding }) {
        super(
            data.building
                ? {
                      ...data.building,
                      type: Buildings.Storage,
                  }
                : {
                      type: Buildings.Storage,
                      status: 'not-started',
                  }
        );
        this.inventory = data.inventory.map((e) => new Item(e));
    }
}
