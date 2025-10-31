import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  // Si l'utilisateur n'est pas connecté, renvoyer vers /login
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login'])
  }
  return true
};
