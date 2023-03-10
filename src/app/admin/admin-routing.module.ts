import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GET_MENU } from '../shared/components/menu/menu.constant';
import { MenuEnum } from '../shared/interface/enums/menu.enum';
import { AdminPage } from './admin.page';

const routes: Routes = [
    {
        path: '',
        component: AdminPage,
        children: [
            { path: '', redirectTo: 'summary', pathMatch: 'full' },
            {
                path: 'summary',
                data: { context: GET_MENU(MenuEnum.summary) },
                loadChildren: () =>
                    import('./summary/summary.module').then(
                        (m) => m.SummaryModule
                    ),
            },
            {
                path: 'base',
                data: { context: GET_MENU(MenuEnum.base) },
                loadChildren: () =>
                    import('./base/base.module').then((m) => m.BaseModule),
            },
            {
                path: 'settlers',
                data: { context: GET_MENU(MenuEnum.settlers) },
                loadChildren: () =>
                    import('./settlers/settlers.module').then(
                        (m) => m.SettlersModule
                    ),
            },
            {
                path: 'settlers/policies',
                data: { context: GET_MENU(MenuEnum.policies) },
                loadChildren: () =>
                    import('./summary/summary.module').then(
                        (m) => m.SummaryModule
                    ),
            },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
