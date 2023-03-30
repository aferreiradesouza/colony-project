import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StoragePage } from './storage.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [StoragePage],
    imports: [CommonModule, StorageRoutingModule, SharedModule],
})
export class StorageModule {}
