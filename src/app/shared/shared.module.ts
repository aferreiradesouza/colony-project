import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { SvgComponent } from './components/svg/svg.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ShortcutTabsComponent } from './components/shortcut-tabs/shortcut-tabs.component';
import { HelperService } from './services/helpers.service';
import { NotificationsShortcutTabComponent } from './components/shortcut-tabs/tabs/notifications-shortcut-tab/notifications-shortcut-tab.component';
import { SettlersShortcutTabComponent } from './components/shortcut-tabs/tabs/settlers-shortcut-tab/settlers-shortcut-tab.component';
import { ToDoListShortcutTabComponent } from './components/shortcut-tabs/tabs/to-do-list-shortcut-tab/to-do-list-shortcut-tab.component';
import { BadgesComponent } from './components/badges/badges.component';
import { MediaService } from './services/media.service';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { SettlersBusiness } from './business/settlers.business';
import { DebugService } from './services/debug.service';
import { GameBusiness } from './business/game.business';
import { CryptHandlerService } from './services/crypt-handler.service';
import { SkillPipe } from './pipe/skill.pipe';
import { WorkPipe } from './pipe/work.pipe';
import { BaseBusiness } from './business/base.business';
import { IAService } from './services/IA.service';
import { StructurePipe } from './pipe/structures.pipe';
import {
    CountdownConfig,
    CountdownGlobalConfig,
    CountdownModule,
} from 'ngx-countdown';
import { StorageBusiness } from './business/storage.business';
import { ConstructionBusiness } from './business/construction.business';
import { SettlerPipe } from './pipe/settler.pipe';
import { LogService } from './services/log.service';
import { NotificationService } from './services/notification.service';

function countdownConfigFactory(): CountdownConfig {
    return { format: 'mm:ss', demand: true };
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(
        http,
        './assets/i18n/',
        `.json?time=${new Date().getTime()}`
    );
}

const COMPONENTS = [
    ButtonComponent,
    SvgComponent,
    HeaderComponent,
    MenuComponent,
    ShortcutTabsComponent,
    NotificationsShortcutTabComponent,
    SettlersShortcutTabComponent,
    ToDoListShortcutTabComponent,
    BadgesComponent,
    ProgressBarComponent,
];

const PIPES = [SkillPipe, WorkPipe, StructurePipe, SettlerPipe];

export const SERVICES_SHARED = [
    SettlersBusiness,
    DebugService,
    GameBusiness,
    BaseBusiness,
    IAService,
    StorageBusiness,
    ConstructionBusiness,
    LogService,
    NotificationService,
];

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        CountdownModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            defaultLanguage: 'pt_br',
            extend: true,
        }),
    ],
    exports: [...COMPONENTS, ...PIPES, TranslateModule],
    declarations: [...COMPONENTS, ...PIPES],
    providers: [
        HelperService,
        MediaService,
        CryptHandlerService,
        { provide: CountdownGlobalConfig, useFactory: countdownConfigFactory },
    ],
})
export class SharedModule {}
