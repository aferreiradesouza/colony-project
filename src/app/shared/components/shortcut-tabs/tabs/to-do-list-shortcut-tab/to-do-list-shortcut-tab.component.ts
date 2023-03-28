import { Component } from '@angular/core';
import { BaseBusiness } from 'src/app/shared/business/base.business';
import { ConstructionBusiness } from 'src/app/shared/business/construction.business';
import { Construction } from 'src/app/shared/model/game/base/construction.model';

@Component({
    selector: 'app-to-do-list-shortcut-tab',
    templateUrl: './to-do-list-shortcut-tab.component.html',
    styleUrls: ['./to-do-list-shortcut-tab.component.scss'],
})
export class ToDoListShortcutTabComponent {
    constructor(
        private baseService: BaseBusiness,
        private constructionsBusiness: ConstructionBusiness
    ) {}

    get contructions(): Construction[] {
        return this.constructionsBusiness.constructions.filter(
            (e) => e.status === 'not-started' || e.status === 'building'
        );
    }
}
