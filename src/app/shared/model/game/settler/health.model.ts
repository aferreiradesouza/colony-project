interface IHealth {
    health: number;
}

export class Health {
    health: number;

    constructor(params: IHealth) {
        this.health = params.health;
    }

    setHealth(num: number): void {
        this.health = num;
    }
}
