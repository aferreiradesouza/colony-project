import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettlersRoutingModule } from './settlers-routing.module';
import { SettlersComponent } from './settlers.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [SettlersComponent],
    imports: [CommonModule, SettlersRoutingModule, SharedModule],
})
export class SettlersModule {}
