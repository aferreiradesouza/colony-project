import { Settler } from '../settler/settler.model';

export class Game {
    public settlers: Settler[];

    constructor(game: { settlers: Settler[] }) {
        this.settlers = game.settlers;
    }
}
