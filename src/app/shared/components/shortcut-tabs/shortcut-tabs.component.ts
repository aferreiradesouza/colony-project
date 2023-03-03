import {
    AfterViewInit,
    Component,
    ElementRef,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { ShortcutData, ShortcutTab } from './shortcut.interface';

@Component({
    selector: 'app-shortcut-tabs',
    templateUrl: 'shortcut-tabs.component.html',
    styleUrls: ['shortcut-tabs.component.scss'],
})
export class ShortcutTabsComponent implements AfterViewInit {
    public initialTab: ShortcutTab = 'notifications';
    public selectedTab: ShortcutTab;

    public tabs: ShortcutData[] = [
        {
            label: 'SHORTCUT_TABS.NOTIFICATIONS',
            value: 'notifications',
            icon: 'bell',
            notifications: 2,
        },
        {
            label: 'SHORTCUT_TABS.SETTLERS',
            value: 'settlers',
            icon: 'userGroup',
            notifications: '!',
        },
        {
            label: 'SHORTCUT_TABS.TO_DO_LIST',
            value: 'to-do-list',
            icon: 'queueList',
        },
    ];

    @ViewChild('tabsArea') tabsArea!: ElementRef<HTMLDivElement>;
    @ViewChildren('tabElement') tabElement!: QueryList<
        ElementRef<HTMLDivElement>
    >;

    constructor(public router: Router) {
        this.selectedTab = this.initialTab;
    }

    ngAfterViewInit(): void {
        this.selectTab(this.selectedTab);
    }

    selectTab(tab: ShortcutTab): void {
        this.selectedTab = tab;
        this.tabElement.toArray().forEach((e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataset = (e.nativeElement.dataset as any)
                .shortcutId as ShortcutTab;
            if (dataset === this.selectedTab)
                e.nativeElement.style.height = `${
                    this.tabsArea.nativeElement.offsetHeight -
                    this.tabs.length * 41
                }px`;
            else e.nativeElement.style.height = '0px';
        });
    }
}
