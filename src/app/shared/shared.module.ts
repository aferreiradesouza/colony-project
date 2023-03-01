import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { SvgComponent } from './components/svg/svg.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

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
];

@NgModule({
    imports: [
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
    providers: [],
})
export class SharedModule {}
