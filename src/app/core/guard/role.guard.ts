// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getCurrentUser();
  const allowedRoles = route.data?.['roles'] as string[];
  
  if (user && allowedRoles?.includes(user.role)) {
    return true;
  }
  
  // Si no tiene permisos, redirigir al login
  console.warn('Acceso denegado. Rol requerido:', allowedRoles);
  router.navigate(['/auth/login']);
  return false;
};