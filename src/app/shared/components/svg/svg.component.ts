import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-svg',
    templateUrl: 'svg.component.html',
    styleUrls: ['svg.component.scss'],
})
export class SvgComponent {
    @Input() symbol!: string;

    constructor() {}
}
