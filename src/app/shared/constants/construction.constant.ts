import { Constructions } from '../model/game/base/construction.model';

export const STRUCTURES: { [key in Constructions]: string } = {
    [Constructions.Factory]: 'Fábrica',
    [Constructions.Farm]: 'Fazenda',
    [Constructions.House]: 'Casa',
    [Constructions.Kitchen]: 'Cozinha',
    [Constructions.Storage]: 'Armazém',
};
