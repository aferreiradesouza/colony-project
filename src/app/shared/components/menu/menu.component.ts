import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss'],
})
export class MenuComponent {
    public menu = [
        { label: 'Resumo', icon: 'chart-bar-square' },
        { label: 'Base', icon: 'home' },
        { label: 'Colonos', icon: 'user-group' },
    ];

    constructor() {}
}
