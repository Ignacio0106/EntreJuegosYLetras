import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JuegosService } from '../services/juegos.service';
import { AvisosService } from '../services/avisos.service';

/** Si el admin deshabilitó el juego, el estudiante vuelve al menú. */
export const juegoHabilitadoGuard: CanActivateFn = (route) => {
  const juegos = inject(JuegosService);
  const avisos = inject(AvisosService);
  const router = inject(Router);
  const slug = route.paramMap.get('slug') ?? '';
  if (juegos.disponible(slug)) return true;
  avisos.toast('Ese juego descansa por ahora. ¡Prueba otro!');
  return router.createUrlTree(['/'], { fragment: 'juegos' });
};
