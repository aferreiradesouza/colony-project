import { Component, HostListener, ViewChild } from '@angular/core';
import {
    fadeInOnEnterAnimation,
    fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { ShortcutTabsComponent } from '../shared/components/shortcut-tabs/shortcut-tabs.component';
import { GameService } from '../shared/services/game.service';
import { IAService } from '../shared/services/IA.service';
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
    public menuIsOpen = false;
    public shortcutIsOpen = false;
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.mediaService.onResize.emit(event);
    }

    @ViewChild(ShortcutTabsComponent) shortcutComponent!: ShortcutTabsComponent;

    constructor(
        private mediaService: MediaService,
        private IAService: IAService
    ) {
        this.IAService.start();
    }

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

    toggleShortcut() {
        this.shortcutComponent.toggle();
    }
}
