import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth-service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiresAdmin = route.data?.['admin'] === true
  if (requiresAdmin && !authService.isAdmin()) {
    return router.createUrlTree(['/home'])
  }
  return true;
};
