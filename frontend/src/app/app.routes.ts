import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';

import { Login } from './user/login/login';
import { NewUser } from './user/new-user/new-user';
import { Admincmp } from './pages/admin/admin';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Events } from './pages/events/events';
import { Heatmap } from './pages/heatmap/heatmap';
import { environment } from '../environments/environment';


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
                    role:environment.ADMIN_ROLE_ID,
                    module:"Administración"
                }
            },
            {
                path:'heatmap',
                component: Heatmap,
                canActivate: [authGuard, roleGuard],
                data:{
                    module:'Mapa de Riesgo'
                }
            },
            {
                path:'events',
                component: Events,
                data:{
                    module:'Eventos Globales'
                }
            }
        ]
    },
];
