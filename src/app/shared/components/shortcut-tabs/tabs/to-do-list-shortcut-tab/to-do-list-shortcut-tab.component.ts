import { Component } from '@angular/core';
import { Construction } from 'src/app/shared/model/game/base/construction.model';
import { BaseService } from 'src/app/shared/services/base.service';

@Component({
    selector: 'app-to-do-list-shortcut-tab',
    templateUrl: './to-do-list-shortcut-tab.component.html',
    styleUrls: ['./to-do-list-shortcut-tab.component.scss'],
})
export class ToDoListShortcutTabComponent {
    constructor(private baseService: BaseService) {}

    get contructions(): Construction[] {
        return this.baseService.contructions.filter(
            (e) => e.status === 'not-started' || e.status === 'building'
        );
    }
}
