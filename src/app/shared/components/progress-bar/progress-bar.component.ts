import { Component, Input } from '@angular/core';
import { Theme } from '../../interface/type';

type Context = 'short';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
    @Input() context: Context = 'short';
    @Input() percent!: number;
    @Input() theme: Theme = 'primary';
}
