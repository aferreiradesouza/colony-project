import {
    IItemDatabase,
    ItemDatabase,
} from 'src/app/shared/database/item.database';
import { Items } from 'src/app/shared/interface/enums/item.enum';
import { HelperService } from 'src/app/shared/services/helpers.service';

export class Item {
    public id: string;
    public type: Items;
    public amount: number;
    public weight: number;
    public taskId?: string;

    constructor(data: { id?: string; type: Items; amount: number }) {
        const itemDatabase = this._getDatabase(data.type);
        this.id = data.id ?? HelperService.guid;
        this.weight = itemDatabase.weight;
        this.type = data.type;
        this.amount = data?.amount ?? 0;
    }

    private _getDatabase(id: Items): IItemDatabase {
        return ItemDatabase.getItemById(id);
    }
}
