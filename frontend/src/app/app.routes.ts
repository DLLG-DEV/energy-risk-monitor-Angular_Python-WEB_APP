import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';

import { Login } from './user/login/login';
import { NewUser } from './user/new-user/new-user';
import { Admincmp } from './pages/admin/admin';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Events } from './pages/events/events';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },

    {
        path: 'new-user',
        component: NewUser
    },
    
    { 
        path: '',
        component: Layout,
        children:[
            {
                path:'admin',
                component: Admincmp,
                canActivate: [authGuard, roleGuard],
                data:{
                    role: 1
                },
            },
            {
                path:'events',
                component: Events,
            }
        ]
    },
];
