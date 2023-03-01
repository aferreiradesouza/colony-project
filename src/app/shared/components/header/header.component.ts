import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
})
export class HeaderComponent {
    public title = '';
    public icon = '';

    constructor(public router: Router) {
        this.router.events.subscribe((event) => {
            if (event instanceof ActivationEnd) {
                if (event.snapshot.data['context']) {
                    const data = event.snapshot.data['context'];
                    this.title = data.label;
                    this.icon = data.icon;
                }
            }
        });
    }
}
