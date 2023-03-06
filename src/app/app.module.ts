import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SERVICES_SHARED, SharedModule } from './shared/shared.module';
import { TranslateStore } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        SharedModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
    ],
    providers: [TranslateStore, ...SERVICES_SHARED],
    bootstrap: [AppComponent],
})
export class AppModule {}
