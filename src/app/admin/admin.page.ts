import { Component } from '@angular/core';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.page.html',
    styleUrls: ['./admin.page.scss'],
})
export class AdminPage {
    menuIsOpen = false;
    title = 'colony-project';

    toggle(): void {
        console.log('oie');
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

    contentClick(event: any) {
        console.log('contentClick');
        if (this.menuIsOpen) this.close();
    }
}
