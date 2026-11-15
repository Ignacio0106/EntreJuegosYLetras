import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Solo deja pasar a quien inició sesión como administrador. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.esAdmin() ? true : router.createUrlTree(['/login'], { queryParams: { volver: state.url } });
};
