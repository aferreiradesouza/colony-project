import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MENU } from './menu.constant';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss'],
})
export class MenuComponent {
    public menu = MENU;

    @Input() isOpen = false;

    constructor(public router: Router) {}
}
