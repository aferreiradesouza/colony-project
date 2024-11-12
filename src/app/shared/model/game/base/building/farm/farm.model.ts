import { Building, BuildingData } from '../building.model';

export class Farm extends Building {
    public level = 1;

    constructor(data: { building: BuildingData }) {
        super(data.building);
    }
}
