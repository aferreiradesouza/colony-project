import { EventEmitter, Injectable } from '@angular/core';
import { ShortcutTab } from '../components/shortcut-tabs/shortcut.interface';

@Injectable({ providedIn: 'root' })
export class ShortcutService {
    activeTab: ShortcutTab = 'notifications';
    onChangeTab = new EventEmitter<ShortcutTab>();

    constructor() {}

    public setTab(tab: ShortcutTab): void {
        if (tab === this.activeTab) return;
        this.activeTab = tab;
        this.onChangeTab.emit(tab);
    }
}
