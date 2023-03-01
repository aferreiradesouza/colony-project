import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MENU } from './menu.constant';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss'],
})
export class MenuComponent {
    public menu = MENU;

    constructor(public router: Router) {}

    clickMenu(url: string): void {
        this.router.navigateByUrl(url);
    }
}
