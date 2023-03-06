export class Health {
    health: number;

    constructor(health: number) {
        this.health = health;
    }

    setHealth(num: number): void {
        this.health = num;
    }
}
