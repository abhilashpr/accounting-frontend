import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';

import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    { path: '', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'superadmin', loadChildren: () => import('./app/pages/superadmin/superadmin.routes') },
    { path: 'staff', loadChildren: () => import('./app/pages/staff/staff.routes') },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
