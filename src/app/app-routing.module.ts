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
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
