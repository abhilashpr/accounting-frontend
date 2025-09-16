import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';

import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from '@/auth-guard';

export const appRoutes: Routes = [
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    {
        path: '', component: AppLayout,
        children: [
            {
                path: 'superadmin',
                loadChildren: () =>
                    import('./app/pages/superadmin/superadmin.routes'),

                data: { roles: ['superadmin'] }
            },
            {
                path: 'staff',
                loadChildren: () =>
                    import('./app/pages/staff/staff.routes'),
                data: { roles: ['staff', 'admin'] }
            }
        ], 
        canActivate: [authGuard]
    },
    { path: 'superadmin', loadChildren: () => import('./app/pages/superadmin/superadmin.routes') },
    { path: 'staff', loadChildren: () => import('./app/pages/staff/staff.routes') },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
