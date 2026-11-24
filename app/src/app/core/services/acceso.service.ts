import { Injectable, signal } from '@angular/core';

/** Permite que cualquier pantalla le pida a la cabecera que abra el panel para crear código o iniciar sesión. */
@Injectable({ providedIn: 'root' })
export class AccesoService {
  readonly peticion = signal(0);

  pedirIniciar(): void {
    this.peticion.update((n) => n + 1);
  }
}
