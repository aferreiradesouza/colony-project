export interface ProfessionConstant {
    title: string;
    name: string;
}

const PROFESSION: ProfessionConstant[] = [
    { title: 'Médico', name: 'Clínico geral' },
    { title: 'Engenheiro', name: 'Civil' },
    { title: 'Advogado', name: 'Criminalista' },
    { title: 'Professor', name: 'Ensino Fundamental' },
    { title: 'Enfermeiro', name: 'Pediátrico' },
    { title: 'Veterinário', name: 'Cirurgião' },
    { title: 'Psicólogo', name: 'Clínico' },
    { title: 'Dentista', name: 'Ortodontista' },
    { title: 'Arquiteto', name: 'Urbanista' },
    { title: 'Jornalista', name: 'Repórter' },
    { title: 'Programador', name: 'Web' },
    { title: 'Analista de sistemas', name: 'Sistemas' },
    { title: 'Designer gráfico', name: 'UI/UX' },
    { title: 'Administrador', name: 'Financeiro' },
    { title: 'Contador', name: 'Fiscal' },
    { title: 'Consultor', name: 'Empresarial' },
    { title: 'Chef de cozinha', name: 'Gourmet' },
    { title: 'Cientista', name: 'Pesquisa' },
    { title: 'Economista', name: 'Financeiro' },
    { title: 'Farmacêutico', name: 'Hospitalar' },
];

export const GET_ALEATORY_PROFESSION = (): ProfessionConstant => {
    const random = Math.floor(Math.random() * PROFESSION.length);
    return PROFESSION[random];
};
