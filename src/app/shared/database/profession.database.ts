interface Profession {
    titulo: string;
    profissao: string;
}

const PROFESSION: Profession[] = [
    { titulo: 'Médico', profissao: 'Clínico geral' },
    { titulo: 'Engenheiro', profissao: 'Civil' },
    { titulo: 'Advogado', profissao: 'Criminalista' },
    { titulo: 'Professor', profissao: 'Ensino Fundamental' },
    { titulo: 'Enfermeiro', profissao: 'Pediátrico' },
    { titulo: 'Veterinário', profissao: 'Cirurgião' },
    { titulo: 'Psicólogo', profissao: 'Clínico' },
    { titulo: 'Dentista', profissao: 'Ortodontista' },
    { titulo: 'Arquiteto', profissao: 'Urbanista' },
    { titulo: 'Jornalista', profissao: 'Repórter' },
    { titulo: 'Programador', profissao: 'Web' },
    { titulo: 'Analista de sistemas', profissao: 'Sistemas' },
    { titulo: 'Designer gráfico', profissao: 'UI/UX' },
    { titulo: 'Administrador', profissao: 'Financeiro' },
    { titulo: 'Contador', profissao: 'Fiscal' },
    { titulo: 'Consultor', profissao: 'Empresarial' },
    { titulo: 'Chef de cozinha', profissao: 'Gourmet' },
    { titulo: 'Cientista', profissao: 'Pesquisa' },
    { titulo: 'Economista', profissao: 'Financeiro' },
    { titulo: 'Farmacêutico', profissao: 'Hospitalar' },
];

export const GET_ALEATORY_PROFESSION = (): Profession => {
    const random = Math.floor(Math.random() * 19);
    return PROFESSION[random];
};
