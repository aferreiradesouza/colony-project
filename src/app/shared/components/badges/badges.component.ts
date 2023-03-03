import { Component, Input } from '@angular/core';

type Context = 'notification';

@Component({
    selector: 'app-badges',
    templateUrl: './badges.component.html',
    styleUrls: ['./badges.component.scss'],
})
export class BadgesComponent {
    @Input() context!: Context;
    @Input() value!: string | number;

    get isNumber(): boolean {
        return typeof this.value === 'number';
    }
}
