import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';

import { Login } from './user/login/login';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },

    { 
        path: '',
        component: Layout,
    }
];
