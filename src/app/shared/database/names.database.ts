interface Name {
    name: string;
    lastname: string;
}

const NAMES: Name[] = [
    { name: 'João', lastname: 'Silva' },
    { name: 'Maria', lastname: 'Santos' },
    { name: 'Pedro', lastname: 'Almeida' },
    { name: 'Lucas', lastname: 'Oliveira' },
    { name: 'Ana', lastname: 'Pereira' },
    { name: 'Mariana', lastname: 'Ribeiro' },
    { name: 'Fernando', lastname: 'Cardoso' },
    { name: 'Aline', lastname: 'Costa' },
    { name: 'Rodrigo', lastname: 'Mendes' },
    { name: 'Juliana', lastname: 'Ferreira' },
    { name: 'Ricardo', lastname: 'Lima' },
    { name: 'Gabriela', lastname: 'Barros' },
    { name: 'Carlos', lastname: 'Sousa' },
    { name: 'Sandra', lastname: 'Nunes' },
    { name: 'Bruno', lastname: 'Moura' },
    { name: 'Vanessa', lastname: 'Carvalho' },
    { name: 'Paulo', lastname: 'Castro' },
    { name: 'Carolina', lastname: 'Dias' },
    { name: 'Eduardo', lastname: 'Freitas' },
    { name: 'Débora', lastname: 'Fernandes' },
    { name: 'Marcelo', lastname: 'Pinto' },
    { name: 'Tatiana', lastname: 'Gonçalves' },
    { name: 'Leandro', lastname: 'Araújo' },
    { name: 'Renata', lastname: 'Martins' },
    { name: 'Gustavo', lastname: 'Farias' },
    { name: 'Isabel', lastname: 'Campos' },
    { name: 'Felipe', lastname: 'Ramos' },
    { name: 'Cintia', lastname: 'Lopes' },
    { name: 'Alexandre', lastname: 'Azevedo' },
    { name: 'Jéssica', lastname: 'Siqueira' },
];

export const GET_ALEATORY_NAME = (): Name => {
    const random = Math.floor(Math.random() * 30);
    return NAMES[random];
};
