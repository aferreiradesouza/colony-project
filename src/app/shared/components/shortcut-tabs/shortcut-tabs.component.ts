import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MediaService } from '../../services/media.service';
import { ShortcutData, ShortcutTab } from './shortcut.interface';

@Component({
    selector: 'app-shortcut-tabs',
    templateUrl: 'shortcut-tabs.component.html',
    styleUrls: ['shortcut-tabs.component.scss'],
})
export class ShortcutTabsComponent implements AfterViewInit, OnDestroy {
    public initialTab: ShortcutTab = 'notifications';
    public selectedTab: ShortcutTab;
    public mode: 'desktop' | 'mobile' = 'desktop';
    public isOpenMobile = false;

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

    @Input() isOpenShortcutTabs = true;

    @ViewChild('tabsArea') tabsArea!: ElementRef<HTMLDivElement>;
    @ViewChildren('tabElement') tabElement!: QueryList<
        ElementRef<HTMLDivElement>
    >;
    public mediaSubscription: Subscription | undefined;

    constructor(public router: Router, private mediaService: MediaService) {
        this.selectedTab = this.initialTab;
        this.mode =
            window.innerWidth >= this.mediaService.lg ? 'desktop' : 'mobile';
        this.isOpenMobile = false;
    }

    ngOnDestroy(): void {
        this.mediaSubscription?.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.selectTab(this.selectedTab, false);
        this.initMediaSubscription();
    }

    initMediaSubscription(): void {
        this.mediaSubscription = this.mediaService.onResize.subscribe(
            (event) => {
                const width = (event.target as any)['innerWidth'];
                if (width >= this.mediaService.lg) this.mode = 'desktop';
                else this.mode = 'mobile';
                console.log(event);
            }
        );
    }

    selectTab(tab: ShortcutTab, toggle = true): void {
        this.selectedTab = tab;
        if (toggle && this.mode === 'mobile') this.toggle();
        console.log(this.mode === 'mobile' && !this.isOpenMobile);
        if (this.mode === 'mobile' && !this.isOpenMobile) return;
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

    get openForMobile(): boolean {
        return this.mode === 'mobile' && this.isOpenMobile;
    }

    toggle(): void {
        this.isOpenMobile ? this.close() : this.open();
    }

    open(): void {
        this.isOpenMobile = true;
    }

    close(): void {
        this.isOpenMobile = true;
    }
}
