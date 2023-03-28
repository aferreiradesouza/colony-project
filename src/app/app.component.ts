import { Component } from '@angular/core';
import { StorageBusiness } from './shared/business/storage.business';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(public StorageService: StorageBusiness) {}
}
