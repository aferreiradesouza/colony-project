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
import { SettlersService } from './services/settlers.service';
import { DebugService } from './services/debug.service';
import { GameService } from './services/game.service';
import { CryptHandlerService } from './services/crypt-handler.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
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

export const SERVICES_SHARED = [SettlersService, DebugService, GameService];

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
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
    exports: [...COMPONENTS, TranslateModule],
    declarations: [...COMPONENTS],
    providers: [HelperService, MediaService, CryptHandlerService],
})
export class SharedModule {}
