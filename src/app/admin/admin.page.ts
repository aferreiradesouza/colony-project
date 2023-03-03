import { Component } from '@angular/core';
import {
    fadeInOnEnterAnimation,
    fadeOutOnLeaveAnimation,
} from 'angular-animations';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.page.html',
    styleUrls: ['./admin.page.scss'],
    animations: [
        fadeInOnEnterAnimation({ duration: 400 }),
        fadeOutOnLeaveAnimation({ duration: 400 }),
    ],
})
export class AdminPage {
    menuIsOpen = false;
    title = 'colony-project';

    toggle(): void {
        setTimeout(() => {
            this.menuIsOpen ? this.close() : this.open();
        }, 0);
    }

    open(): void {
        this.menuIsOpen = true;
    }

    close(): void {
        this.menuIsOpen = false;
    }

    contentClick() {
        if (this.menuIsOpen) this.close();
    }
}
