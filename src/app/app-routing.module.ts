import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'offsite', pathMatch: 'full' },
    {
        path: 'offsite',
        loadChildren: () =>
            import('./offsite/offsite.module').then((m) => m.OffsiteModule),
    },
    {
        path: 'summary',
        loadChildren: () =>
            import('./summary/summary.module').then((m) => m.SummaryModule),
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
