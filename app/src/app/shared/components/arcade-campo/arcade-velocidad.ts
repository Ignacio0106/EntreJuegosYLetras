import { Component, input, model } from '@angular/core';
import { VELOCIDADES } from '../../utils/arcade-base';

/** Pantalla de inicio de los juegos de acción: elegir el ritmo (usa las clases .selector globales). */
@Component({
  selector: 'app-arcade-velocidad',
  template: `
    <h3>¿A qué velocidad quieres jugar?</h3>
    <div class="selector">
      @for (v of velocidades; track v.id) {
        <button type="button" [attr.aria-pressed]="velocidad() === v.id" (click)="velocidad.set(v.id)">
          <strong>{{ v.titulo }}</strong><small>{{ v.ayuda }}</small>
        </button>
      }
    </div>
    @if (nota()) { <p class="nota">{{ nota() }}</p> }
  `,
})
export class ArcadeVelocidad {
  readonly velocidad = model('normal');
  readonly nota = input('');
  protected readonly velocidades = VELOCIDADES;
}
