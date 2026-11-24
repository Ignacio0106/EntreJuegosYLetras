import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Solo deja pasar a quien inició sesión como administrador. */
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.listo;
  return auth.esDocente() ? true : router.createUrlTree(['/login'], { queryParams: { volver: state.url } });
};
