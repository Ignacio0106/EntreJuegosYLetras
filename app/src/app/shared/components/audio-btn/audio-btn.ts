import { Component, computed, inject, input } from '@angular/core';
import { VozService } from '../../../core/services/voz.service';

let contador = 0;

/** Botón 🔊 que lee un texto en voz alta (apoyo para quienes empiezan a leer). */
@Component({
  selector: 'app-audio-btn',
  template: `
    @if (voz.soportado) {
      <button type="button" class="audio" [class.activo]="leyendo()" (click)="alternar()"
        [attr.aria-pressed]="leyendo()" [attr.aria-label]="leyendo() ? 'Detener la lectura' : etiqueta()">
        <span aria-hidden="true">{{ leyendo() ? '⏹' : '🔊' }}</span>
      </button>
    }
  `,
  styles: `
    .audio {
      flex: none; width: 48px; height: 48px; border-radius: 50%; border: 3px solid var(--tinta);
      background: var(--cielo); font-size: 1.3rem; cursor: pointer; line-height: 1;
      box-shadow: 0 4px 0 var(--tinta); transition: transform .09s, box-shadow .09s;
    }
    .audio:hover { transform: translateY(-2px); }
    .audio:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--tinta); }
    .audio.activo { background: var(--sol); }
  `,
})
export class AudioBtn {
  protected readonly voz = inject(VozService);
  readonly texto = input.required<string>();
  readonly etiqueta = input('Escuchar este texto');
  private readonly id = 'audio-' + ++contador;
  protected readonly leyendo = computed(() => this.voz.hablando() === this.id);

  protected alternar(): void {
    this.voz.alternar(this.texto(), this.id);
  }
}
