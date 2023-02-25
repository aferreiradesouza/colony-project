import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { SvgComponent } from './components/svg/svg.component';

const COMPONENTS = [ButtonComponent, SvgComponent];

@NgModule({
    imports: [CommonModule],
    exports: [...COMPONENTS],
    declarations: [...COMPONENTS],
    providers: [],
})
export class SharedModule {}
