interface Profession {
    title: string;
    profession: string;
}

const PROFESSION: Profession[] = [
    { title: 'Médico', profession: 'Clínico geral' },
    { title: 'Engenheiro', profession: 'Civil' },
    { title: 'Advogado', profession: 'Criminalista' },
    { title: 'Professor', profession: 'Ensino Fundamental' },
    { title: 'Enfermeiro', profession: 'Pediátrico' },
    { title: 'Veterinário', profession: 'Cirurgião' },
    { title: 'Psicólogo', profession: 'Clínico' },
    { title: 'Dentista', profession: 'Ortodontista' },
    { title: 'Arquiteto', profession: 'Urbanista' },
    { title: 'Jornalista', profession: 'Repórter' },
    { title: 'Programador', profession: 'Web' },
    { title: 'Analista de sistemas', profession: 'Sistemas' },
    { title: 'Designer gráfico', profession: 'UI/UX' },
    { title: 'Administrador', profession: 'Financeiro' },
    { title: 'Contador', profession: 'Fiscal' },
    { title: 'Consultor', profession: 'Empresarial' },
    { title: 'Chef de cozinha', profession: 'Gourmet' },
    { title: 'Cientista', profession: 'Pesquisa' },
    { title: 'Economista', profession: 'Financeiro' },
    { title: 'Farmacêutico', profession: 'Hospitalar' },
];

export const GET_ALEATORY_PROFESSION = (): Profession => {
    const random = Math.floor(Math.random() * PROFESSION.length);
    return PROFESSION[random];
};
