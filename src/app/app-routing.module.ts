import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./admin/admin.module').then((m) => m.AdminModule),
    },
    {
        path: 'offsite',
        loadChildren: () =>
            import('./offsite/offsite.module').then((m) => m.OffsiteModule),
    },
    { path: 'storage', loadChildren: () => import('./admin/storage/storage.module').then(m => m.StorageModule) },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
