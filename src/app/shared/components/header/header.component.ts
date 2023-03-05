import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Icon } from '../../interface/type';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
})
export class HeaderComponent {
    public title: string;
    public icon: Icon;

    @Input() shortcutIsOpen!: boolean;

    @Output() clickMenu = new EventEmitter();
    @Output() clickMenuShortcut = new EventEmitter();

    constructor(public router: Router) {
        this.title = '';
        this.icon = 'home';
        this.router.events.subscribe((event) => {
            if (event instanceof ActivationEnd) {
                if (event.snapshot.data['context']) {
                    const data = event.snapshot.data['context'];
                    this.title = data.label;
                    this.icon = data.icon as Icon;
                }
            }
        });
    }
}
