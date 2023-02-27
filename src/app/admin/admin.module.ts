import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminPage } from './admin.page';

const PAGES = [AdminPage];

@NgModule({
    imports: [SharedModule, AdminRoutingModule, CommonModule],
    exports: [],
    declarations: [...PAGES],
    providers: [],
})
export class AdminModule {}
