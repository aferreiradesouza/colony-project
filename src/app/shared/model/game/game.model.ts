import { Base } from './base/base.model';

export class Game {
    public id: string;
    public base: Base;

    constructor(game: { id: string; base: Base }) {
        this.id = game.id;
        this.base = new Base(game.base);
    }
}
