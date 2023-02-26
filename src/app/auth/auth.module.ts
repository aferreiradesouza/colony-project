import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    imports: [AuthRoutingModule, SharedModule],
    exports: [],
    declarations: [],
    providers: [],
})
export class AuthModule { }
