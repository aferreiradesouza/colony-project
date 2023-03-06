import { Component } from '@angular/core';
import { ToDoListShortcut } from '../../shortcut.interface';

@Component({
    selector: 'app-to-do-list-shortcut-tab',
    templateUrl: './to-do-list-shortcut-tab.component.html',
    styleUrls: ['./to-do-list-shortcut-tab.component.scss'],
})
export class ToDoListShortcutTabComponent {
    public mock: ToDoListShortcut[] = [
        {
            work: 'Desenvolvimento de um aplicativo móvel',
            id: '4b33fa1b-f4e9-44b9-9d64-43a42ca76c22',
            progress: 75,
            timeLeft: 1000,
        },
        {
            work: 'Criação de um site de e-commerce',
            id: 'e7d6f12c-62ab-4d54-83f3-96534c1de20e',
            progress: 50,
            timeLeft: 1000,
        },
        {
            work: 'Produção de um vídeo institucional',
            id: '901f78e5-89f8-44c9-9bdc-1c83d131b33e',
            progress: 30,
            timeLeft: 1000,
        },
        {
            work: 'Desenvolvimento de um sistema de gestão',
            id: 'ba57b759-24c2-42b8-b8b9-9cda838e51b6',
            progress: 10,
            timeLeft: 1000,
        },
        {
            work: 'Planejamento de campanha publicitária',
            id: 'fe7d725c-cd1f-4e0a-a4d2-1e625b81e529',
            progress: 80,
            timeLeft: 1000,
        },
        {
            work: 'Treinamento de funcionários',
            id: 'cdd6a30a-fdbf-44d7-bd37-d5cb5bb5a1e1',
            progress: 40,
            timeLeft: 1000,
        },
        {
            work: 'Elaboração de relatório financeiro',
            id: 'e536a58a-6967-4a3c-9047-3dc07af69cd4',
            progress: 20,
            timeLeft: 1000,
        },
        {
            work: 'Desenvolvimento de um jogo eletrônico',
            id: 'a0515b5f-09e1-4a13-a531-91f8d998b018',
            progress: 60,
            timeLeft: 1000,
        },
        {
            work: 'Desenho arquitetônico de um prédio',
            id: 'd24a6a77-ff10-4daa-9b7d-63cb84e44a57',
            progress: 90,
            timeLeft: 1000,
        },
        {
            work: 'Implementação de um sistema de segurança',
            id: 'c16a5f2d-0e02-45b1-aa9c-033ec37c9125',
            progress: 15,
            timeLeft: 1000,
        },
    ];

    constructor() {}
}
