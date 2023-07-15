import { Building, IBuilding } from '../building.model';

export class Farm extends Building {
    public level = 1;

    constructor(data: { building: IBuilding }) {
        super(data.building);
    }
}
