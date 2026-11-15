import { Component, computed, input } from '@angular/core';

/** Tres estrellas de progreso (0 a 3). */
@Component({
  selector: 'app-estrellas',
  template: `
    <span class="estrellas" [class.grande]="grande()" role="img" [attr.aria-label]="valor() + ' de 3 estrellas'">
      @for (e of lista; track e) {
        <span class="e" [class.llena]="e <= valor()" aria-hidden="true">★</span>
      }
    </span>
  `,
  styles: `
    .estrellas { display: inline-flex; gap: .1em; font-size: 1.35rem; line-height: 1; }
    .estrellas.grande { font-size: 3rem; gap: .15em; }
    .e { color: #d3e3ee; -webkit-text-stroke: 1.5px #9db6c8; }
    .e.llena { color: var(--sol); -webkit-text-stroke: 1.5px var(--tinta); }
  `,
})
export class Estrellas {
  readonly valor = input(0);
  readonly grande = input(false);
  protected readonly lista = [1, 2, 3];
  protected readonly texto = computed(() => `${this.valor()} de 3`);
}
