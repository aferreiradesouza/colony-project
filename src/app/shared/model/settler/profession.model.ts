export class Profession {
    name: string;
    title: string;

    constructor(profession: { name: string; title: string }) {
        this.name = profession.name;
        this.title = profession.title;
    }
}
