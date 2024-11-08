interface INecessity {
    hunger: number;
    fun: number;
    rest: number;
}

export class Necessity {
    public hunger: number;
    public fun: number;
    public rest: number;

    constructor(necessity: INecessity) {
        this.hunger = necessity.hunger;
        this.fun = necessity.fun;
        this.rest = necessity.rest;
    }
}
