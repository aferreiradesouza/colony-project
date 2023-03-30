import { Tasks } from 'src/app/shared/interface/enums/tasks.enum';
import { Game } from '../../game.model';

export class Task {
    public id: Tasks;
    public assignedTo: string | null;
    public baseTimeMs: number;
    public available: boolean;
    public requirements?: (
        game: Game
    ) => { id: string; message: string }[] | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public interval: any = null;

    constructor(data: {
        id: Tasks;
        assignedTo: string | null;
        baseTimeMs: number;
        available: boolean;
        requirements?: (game: Game) => { id: string; message: string }[] | null;
    }) {
        this.id = data.id;
        this.assignedTo = data.assignedTo;
        this.baseTimeMs = data.baseTimeMs;
        this.available = data.available;
        this.requirements = data.requirements;
    }
}
