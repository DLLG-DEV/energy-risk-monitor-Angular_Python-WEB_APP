// PARA VERIFICAR QUE EL USUARIO TENGA EL PERMISO CORRESPONDIENTE

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {

    const auth = inject(AuthService);
    const router = inject(Router);

    const payload = auth.decodeToken();

    const requiredRole = route.data['role'];

    if (payload?.rol === requiredRole) {
        return true;
    }

    router.navigate(['/']);
    return false;
};