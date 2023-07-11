import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiomesRoutingModule } from './biomes-routing.module';
import { BiomesComponent } from './biomes.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [BiomesComponent],
    imports: [CommonModule, BiomesRoutingModule, SharedModule],
})
export class BiomesModule {}
