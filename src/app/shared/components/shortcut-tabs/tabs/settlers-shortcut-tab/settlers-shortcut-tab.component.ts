import { Component } from '@angular/core';
import { Settler } from 'src/app/shared/model/game/settler/settler.model';
import { SettlersBusiness } from 'src/app/shared/business/settlers.business';

@Component({
    selector: 'app-settlers-shortcut-tab',
    templateUrl: './settlers-shortcut-tab.component.html',
    styleUrls: ['./settlers-shortcut-tab.component.scss'],
})
export class SettlersShortcutTabComponent {
    constructor(private settlerService: SettlersBusiness) {}

    get settlers(): Settler[] {
        return this.settlerService.settlers;
    }
}
