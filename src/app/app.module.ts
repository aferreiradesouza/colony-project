import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SERVICES_SHARED, SharedModule } from './shared/shared.module';
import { TranslateStore } from '@ngx-translate/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule], providers: [TranslateStore, ...SERVICES_SHARED, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
