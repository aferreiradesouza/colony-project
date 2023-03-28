import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StoragePage } from './storage.page';

@NgModule({
    declarations: [StoragePage],
    imports: [CommonModule, StorageRoutingModule],
})
export class StorageModule {}
