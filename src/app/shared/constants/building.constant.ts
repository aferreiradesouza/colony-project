import { Buildings } from '../interface/enums/buildings.enum';

export const STRUCTURES: { [key in Buildings]: string } = {
    [Buildings.Factory]: 'Fábrica',
    [Buildings.Farm]: 'Fazenda',
    [Buildings.House]: 'Casa',
    [Buildings.Kitchen]: 'Cozinha',
    [Buildings.Storage]: 'Armazém',
};
