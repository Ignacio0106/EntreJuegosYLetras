import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AudioBtn } from '../audio-btn/audio-btn';
import { Estrellas } from '../estrellas/estrellas';
import { Fase } from '../../utils/juego-base';

/**
 * Marco común de cada juego: pantalla de inicio, contenido del juego y pantalla final.
 * - <div intro>…</div> agrega opciones extra en la pantalla de inicio.
 * - El resto del contenido se muestra mientras el juego está en marcha.
 */
@Component({
  selector: 'app-game-shell',
  imports: [AudioBtn, Estrellas, RouterLink],
  template: `
    @if (fase() === 'intro') {
      <section class="tarjeta intro">
        <div class="cab">
          <h2>{{ titulo() }}</h2>
          <app-audio-btn [texto]="titulo() + '. ' + mensaje() + ' ' + aprendemos()" />
        </div>
        <p class="msg">{{ mensaje() }}</p>
        @if (aprendemos()) {
          <div class="aprendemos">
            <strong>🎓 Hoy aprendemos</strong>
            <p>{{ aprendemos() }}</p>
          </div>
        }
        <ng-content select="[intro]" />
        <button type="button" class="btn btn-menta btn-grande" (click)="iniciar.emit()">{{ boton() }}</button>
      </section>
    }

    <ng-content />

    @if (fase() === 'final') {
      <section class="tarjeta centro final">
        <app-estrellas [valor]="estrellas()" [grande]="true" />
        <h2>{{ finalTitulo() }}</h2>
        <p>{{ finalTexto() }}</p>
        <div class="fila centro">
          <button type="button" class="btn btn-sol btn-grande" (click)="iniciar.emit()">Jugar otra vez</button>
          <a class="btn btn-claro btn-grande" routerLink="/" fragment="juegos">Ver más juegos</a>
        </div>
      </section>
    }
  `,
  styles: `
    .cab { display: flex; gap: .8rem; align-items: center; justify-content: space-between; }
    .msg { font-size: 1.2rem; }
    .aprendemos { background: var(--menta-suave); border-radius: var(--radio-s); padding: .9rem 1.2rem; margin: 1rem 0 1.4rem; }
    .aprendemos p { margin: .2rem 0 0; }
    .final h2 { margin-top: .6rem; }
    .final p { font-size: 1.15rem; }
  `,
})
export class GameShell {
  readonly titulo = input.required<string>();
  readonly mensaje = input.required<string>();
  readonly aprendemos = input('');
  readonly boton = input('¡Comenzar!');
  readonly fase = input.required<Fase>();
  readonly finalTitulo = input('');
  readonly finalTexto = input('');
  readonly estrellas = input(0);
  readonly iniciar = output<void>();
}
