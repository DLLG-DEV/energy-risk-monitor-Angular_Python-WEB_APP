import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const payload = auth.decodeToken();

    if (!payload) {
        router.navigate(['/login']);
        return false;
    }

    const requiredRole = route.data['rol'];
    const requiredModule = route.data['modulos'];

    // Validación por rol (solo si la ruta lo requiere)
    if (requiredRole !== undefined) {
        if (payload.rol !== requiredRole) {
            router.navigate(['/']);
            return false;
        }
    }

    // Validación por módulo (solo si la ruta lo requiere)
    if (requiredModule) {
        if (!payload.modulos?.includes(requiredModule)) {
            router.navigate(['/']);
            return false;
        }
    }

    return true;
};