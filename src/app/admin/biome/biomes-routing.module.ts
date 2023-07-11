import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiomesComponent } from './biomes.component';

const routes: Routes = [{ path: '', component: BiomesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BiomesRoutingModule {}
