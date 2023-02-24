import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';

const COMPONENTS = [
    ButtonComponent
]

@NgModule({
    imports: [],
    exports: [...COMPONENTS],
    declarations: [...COMPONENTS],
    providers: [],
})
export class SharedModule { }
