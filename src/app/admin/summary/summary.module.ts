import { NgModule } from '@angular/core';
import { TranslateStore } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryPage } from './summary.page';

const PAGES = [SummaryPage];

@NgModule({
    imports: [SummaryRoutingModule, SharedModule],
    exports: [],
    declarations: [...PAGES],
    providers: [],
})
export class SummaryModule {}
