import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AjustesNubeService } from '../services/ajustes-nube.service';
import { AuthService } from '../services/auth.service';
import { AvisosService } from '../services/avisos.service';
import { JuegosService } from '../services/juegos.service';

/** Si el admin deshabilitó el juego, el estudiante vuelve al menú. Espera a Firebase para no usar datos viejos. */
export const juegoHabilitadoGuard: CanActivateFn = async (route) => {
  const juegos = inject(JuegosService);
  const avisos = inject(AvisosService);
  const router = inject(Router);
  await Promise.all([inject(AuthService).listo, inject(AjustesNubeService).listo]);
  const slug = route.paramMap.get('slug') ?? '';
  if (juegos.disponible(slug)) return true;
  avisos.toast('Ese juego descansa por ahora. ¡Prueba otro!');
  return router.createUrlTree(['/'], { fragment: 'juegos' });
};
