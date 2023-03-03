import { Component, Input } from '@angular/core';
import { Icon } from '../../interface/type';

@Component({
    selector: 'app-svg',
    templateUrl: 'svg.component.html',
    styleUrls: ['svg.component.scss'],
})
export class SvgComponent {
    @Input() symbol!: Icon;

    constructor() {}
}
