import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';

import { Login } from './user/login/login';
import { NewUser } from './user/new-user/new-user';

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
    }
];
