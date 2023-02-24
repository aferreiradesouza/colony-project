import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { OffsiteRoutingModule } from './offsite-routing.module';

import { StyleguidePage } from './styleguide/styleguide.page';

@NgModule({
    imports: [OffsiteRoutingModule, SharedModule],
    exports: [],
    declarations: [StyleguidePage],
    providers: [],
})
export class OffsiteModule { }
