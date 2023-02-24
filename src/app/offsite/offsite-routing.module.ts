import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StyleguidePage } from './styleguide/styleguide.page';

const routes: Routes = [
    { path: '', redirectTo: 'styleguide', pathMatch: 'full'},
    { path: 'styleguide', component: StyleguidePage},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffsiteRoutingModule { }
