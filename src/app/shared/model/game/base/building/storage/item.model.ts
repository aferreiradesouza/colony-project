import { Itens } from 'src/app/shared/interface/enums/item.enum';

export class Item {
    public id: string;
    public type: Itens;
    public amount: number;
    public taskId?: string;

    constructor(data: { id: string; type: Itens; amount: number }) {
        this.id = data.id;
        this.type = data.type;
        this.amount = data?.amount ?? 0;
    }
}
