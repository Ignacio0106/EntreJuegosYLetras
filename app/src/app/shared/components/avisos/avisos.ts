import { Component, inject } from '@angular/core';
import { AvisosService } from '../../../core/services/avisos.service';

/** Muestra toasts, el cuadro "¿Sabías qué?" y los avisos con botón. Se coloca una sola vez en App. */
@Component({
  selector: 'app-avisos',
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of avisos.toasts(); track t.id) { <div class="toast">{{ t.texto }}</div> }
    </div>

    @if (avisos.sabias(); as s) {
      <aside class="sabias" role="status">
        <button type="button" class="x" (click)="avisos.cerrarSabias()" aria-label="Cerrar">×</button>
        <span class="chip">💡 ¿Sabías qué?</span>
        @if (s.titulo) { <h4>{{ s.titulo }}</h4> }
        <p>{{ s.texto }}</p>
      </aside>
    }

    @if (avisos.aviso(); as a) {
      <div class="velo" (click)="avisos.cerrarAviso()">
        <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="a.titulo" (click)="$event.stopPropagation()">
          <h2>{{ a.titulo }}</h2>
          <p>{{ a.texto }}</p>
          <button type="button" class="btn btn-menta btn-grande" (click)="avisos.cerrarAviso()">{{ a.boton }}</button>
        </div>
      </div>
    }
  `,
  styles: `
    .toasts { position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%); z-index: 400; display: grid; gap: .5rem; justify-items: center; width: min(92vw, 440px); }
    .toast { background: var(--tinta); color: #fff; padding: .7em 1.3em; border-radius: 999px; font: 700 1rem var(--f-titulo); animation: sube .25s ease-out; }
    .sabias {
      position: fixed; right: 18px; bottom: 18px; z-index: 350; width: min(92vw, 360px);
      background: var(--sol-suave); border: 3px solid var(--tinta); border-radius: 22px; padding: 1rem 1.2rem;
      box-shadow: 0 6px 0 var(--tinta); animation: sube .3s ease-out;
    }
    .sabias h4 { margin: .4rem 0 .2rem; }
    .sabias p { margin: 0; font-size: 1rem; }
    .chip { display: inline-block; background: var(--sol); border-radius: 999px; padding: .1em .8em; font: 800 .85rem var(--f-titulo); }
    .x { position: absolute; top: 6px; right: 8px; width: 40px; height: 40px; border: 0; background: transparent; font-size: 1.8rem; cursor: pointer; color: var(--tinta); }
    .velo { position: fixed; inset: 0; background: rgba(35, 50, 74, .55); z-index: 500; display: grid; place-items: center; padding: 1rem; }
    .modal { background: #fff; border: 3px solid var(--tinta); border-radius: 30px; padding: 2rem; text-align: center; max-width: 460px; box-shadow: 0 8px 0 var(--tinta); animation: sube .25s ease-out; }
    .modal p { margin-inline: auto; font-size: 1.15rem; }
    @keyframes sube { from { transform: translateY(14px); opacity: 0; } to { transform: none; opacity: 1; } }
    .toasts .toast { animation-name: sube; }
  `,
})
export class Avisos {
  protected readonly avisos = inject(AvisosService);
}
