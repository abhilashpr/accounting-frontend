import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';

import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from '@/auth-guard';

export const appRoutes: Routes = [
    { path: '', loadChildren: () => import('./app/pages/auth/auth.routes') },
    {
        path: 'superadmin', component: AppLayout,
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./app/pages/superadmin/superadmin.routes'),

                data: { roles: ['superadmin'] }
            },
            
        ], 
        canActivate: [authGuard]
    },
    {
        path: 'staff',
        component: AppLayout,
        children: [
            {
                path: '',
                loadChildren: () => import('./app/pages/staff/staff.routes'),
                data: { roles: ['admin', 'staff'] }
            }
        ],
        canActivate: [authGuard]
    },
    { path: 'superadmin', loadChildren: () => import('./app/pages/superadmin/superadmin.routes') },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
