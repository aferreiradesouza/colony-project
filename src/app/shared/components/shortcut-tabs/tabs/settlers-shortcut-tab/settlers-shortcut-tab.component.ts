import { Component } from '@angular/core';
import { Settler } from 'src/app/shared/model/game/settler/settler.model';
import { SettlersService } from 'src/app/shared/services/settlers.service';

@Component({
    selector: 'app-settlers-shortcut-tab',
    templateUrl: './settlers-shortcut-tab.component.html',
    styleUrls: ['./settlers-shortcut-tab.component.scss'],
})
export class SettlersShortcutTabComponent {
    constructor(private settlerService: SettlersService) {}

    get settlers(): Settler[] {
        return this.settlerService.settlers;
    }
}
