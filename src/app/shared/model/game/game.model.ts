import { Base } from '../base/base.model';
import { Settler } from '../settler/settler.model';

export class Game {
    public id: string;
    public settlers: Settler[];
    public base: Base;

    constructor(game: { id: string; settlers: Settler[]; base: Base }) {
        this.id = game.id;
        this.settlers = game.settlers.map((e) => new Settler(e));
        this.base = new Base(game.base);
    }

    addSettler(settler: Settler): void {
        this.settlers.push(settler);
    }

    replaceSettler(settlers: Settler[]): void {
        this.settlers = settlers;
    }
}
