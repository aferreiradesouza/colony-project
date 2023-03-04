import { Component, HostListener } from '@angular/core';
import {
    fadeInOnEnterAnimation,
    fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { MediaService } from '../shared/services/media.service';

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
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.mediaService.onResize.emit(event);
    }

    constructor(private mediaService: MediaService) {}

    toggle(): void {
        this.menuIsOpen ? this.close() : this.open();
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
