import { Component } from '@angular/core';
import { StorageBusiness } from 'src/app/shared/business/storage.business';
import { Item } from 'src/app/shared/model/game/base/building/storage/item.model';

@Component({
    selector: 'app-inventory-shortcut-tab',
    templateUrl: './inventory-shortcut-tab.component.html',
    styleUrls: ['./inventory-shortcut-tab.component.scss'],
})
export class InventoryShortcutTabComponent {
    constructor(private storageBusiness: StorageBusiness) {}

    get storage(): Item[] {
        return this.storageBusiness.inventory;
    }
}
