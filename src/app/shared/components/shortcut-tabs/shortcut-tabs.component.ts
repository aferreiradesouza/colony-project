import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
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

    @Input() hasOpenMobile = false;
    @Output() hasOpenMobileChange = new EventEmitter<boolean>();

    @ViewChild('tabsArea') tabsArea!: ElementRef<HTMLDivElement>;
    @ViewChildren('tabElement') tabElement!: QueryList<
        ElementRef<HTMLDivElement>
    >;
    public mediaSubscription: Subscription | undefined;

    constructor(public router: Router, private mediaService: MediaService) {
        this.selectedTab = this.initialTab;
        this.mode =
            window.innerWidth >= this.mediaService.lg ? 'desktop' : 'mobile';
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const width = (event.target as any)['innerWidth'];
                if (width >= this.mediaService.lg) this.mode = 'desktop';
                else this.mode = 'mobile';
                this.updateRenderTabs();
            }
        );
    }

    selectTab(tab: ShortcutTab, canBeOpened = true): void {
        this.selectedTab = tab;
        if (canBeOpened && this.mode === 'mobile') this.open();
        this.updateRenderTabs();
    }

    get openForMobile(): boolean {
        return this.mode === 'mobile' && this.hasOpenMobile;
    }

    updateRenderTabs(): void {
        this.tabElement.toArray().forEach((e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataset = (e.nativeElement.dataset as any)
                .shortcutId as ShortcutTab;
            if (
                (this.mode === 'mobile' &&
                    dataset === this.selectedTab &&
                    this.hasOpenMobile) ||
                (this.mode === 'desktop' && dataset === this.selectedTab)
            )
                e.nativeElement.style.height = `${
                    this.tabsArea.nativeElement.offsetHeight -
                    this.tabs.length * 41
                }px`;
            else e.nativeElement.style.height = '0px';
        });
    }

    toggle(): void {
        this.hasOpenMobile ? this.close() : this.open();
        this.updateRenderTabs();
    }

    open(): void {
        this.hasOpenMobile = true;
        this.hasOpenMobileChange.emit(this.hasOpenMobile);
    }

    close(): void {
        this.hasOpenMobile = false;
        this.hasOpenMobileChange.emit(this.hasOpenMobile);
    }
}
