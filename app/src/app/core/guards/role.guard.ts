import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Role } from '../models/role.model';
import { AuthService } from '../services/auth.service';

/** Revisa que el rol actual esté en route.data['roles']. */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const permitidos = route.data['roles'] as Role[] | undefined;
  if (!permitidos?.length) return true;
  return auth.tieneRol(permitidos) ? true : router.createUrlTree(['/sin-autorizacion']);
};
