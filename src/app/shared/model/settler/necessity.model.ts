interface INecessity {
    hungry: number;
    fun: number;
    rest: number;
}

export class Necessity {
    public hungry: number;
    public fun: number;
    public rest: number;

    constructor(necessity: INecessity) {
        this.hungry = necessity.hungry;
        this.fun = necessity.fun;
        this.rest = necessity.rest;
    }
}
