import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettlersComponent } from './settlers.component';

const routes: Routes = [{ path: '', component: SettlersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettlersRoutingModule { }
