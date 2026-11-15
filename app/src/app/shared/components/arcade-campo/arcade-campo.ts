import { Component, input, output, ViewEncapsulation } from '@angular/core';

/**
 * Campo de juego para los juegos de acción: marcador + botón de pausa, escenario con fondo,
 * destello al acertar/fallar y (si se pide) botones ◀ ▶ para mover la cesta.
 * - <span datos>…</span> va en el marcador.
 * - El resto del contenido se dibuja dentro del escenario.
 * Sus estilos usan el prefijo "arc-" y sin encapsulación, para que los juegos que se proyectan
 * adentro (palabras que caen, globos, peces…) los reutilicen sin repetir CSS.
 */
@Component({
  selector: 'app-arcade-campo',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="arc-barra">
      <div class="arc-datos"><ng-content select="[datos]" /></div>
      <button type="button" class="btn btn-claro btn-mini" [attr.aria-pressed]="pausado()" (click)="pausar.emit()">
        {{ pausado() ? '▶ Seguir' : '⏸ Pausa' }}
      </button>
    </div>

    <div class="arc-campo" [attr.data-fondo]="fondo()" [class.arc-libre]="libre()" [class.arc-toca]="controles()"
      [class.arc-ok]="flash() === 'ok'" [class.arc-mal]="flash() === 'mal'"
      (pointermove)="puntero($event)" (pointerdown)="puntero($event)">
      <ng-content />
      @if (pausado()) {
        <div class="arc-pausa" role="status">⏸ En pausa</div>
      }
    </div>

    @if (controles()) {
      <div class="arc-ctrl">
        <button type="button" class="btn btn-cielo btn-grande" aria-label="Mover a la izquierda"
          (pointerdown)="mover.emit(-1)" (pointerup)="mover.emit(0)" (pointerleave)="mover.emit(0)"
          (pointercancel)="mover.emit(0)" (contextmenu)="$event.preventDefault()">◀</button>
        <button type="button" class="btn btn-cielo btn-grande" aria-label="Mover a la derecha"
          (pointerdown)="mover.emit(1)" (pointerup)="mover.emit(0)" (pointerleave)="mover.emit(0)"
          (pointercancel)="mover.emit(0)" (contextmenu)="$event.preventDefault()">▶</button>
      </div>
    }
  `,
  styles: `
    app-arcade-campo { display: block; }
    .arc-barra { display: flex; gap: .8rem; align-items: center; justify-content: space-between; margin-bottom: .7rem; }
    .arc-datos { font: 800 1.05rem var(--f-titulo); color: var(--cielo-fuerte); display: flex; gap: .4rem 1.1rem; flex-wrap: wrap; }

    .arc-campo {
      position: relative; overflow: hidden; user-select: none; -webkit-user-select: none;
      aspect-ratio: 16 / 10; border: 3px solid var(--tinta); border-radius: var(--radio);
      box-shadow: 0 7px 0 var(--tinta); background: linear-gradient(180deg, #bfe8ff, #eaf8ff 80%);
      transition: border-color .15s;
    }
    .arc-campo.arc-toca { touch-action: none; cursor: ew-resize; }
    .arc-campo.arc-ok { border-color: var(--menta-fuerte); }
    .arc-campo.arc-mal { border-color: var(--coral-fuerte); }
    .arc-campo.arc-libre { aspect-ratio: auto; padding: 1rem; min-height: 14rem; }
    @media (max-width: 640px) { .arc-campo:not(.arc-libre) { aspect-ratio: 4 / 5; } }

    .arc-campo[data-fondo='cielo'] { background: linear-gradient(180deg, #8fd4ff, #e6f7ff); }
    .arc-campo[data-fondo='mar'] { background: linear-gradient(180deg, #a6e3ff 0%, #4fb2ec 55%, #2b8fd0 100%); }
    .arc-campo[data-fondo='granja'] { background: linear-gradient(180deg, #dcf8ec, #b9ecd2); }
    .arc-campo[data-fondo='prado']::after {
      content: ''; position: absolute; inset: auto 0 0 0; height: 8%; z-index: 1; pointer-events: none;
      background: var(--menta); border-top: 3px solid var(--tinta);
    }

    .arc-item { position: absolute; transform: translate(-50%, -50%); z-index: 2; }
    .arc-chip {
      background: var(--blanco); color: var(--tinta); border: 3px solid var(--tinta); border-radius: 999px;
      padding: .3em .85em; box-shadow: 0 3px 0 var(--tinta); max-width: 38%; text-align: center;
      font: 800 clamp(.8rem, 2.3vw, 1rem)/1.15 var(--f-titulo); text-wrap: balance; pointer-events: none;
    }
    .arc-gota { background: var(--sol-suave); font-size: clamp(1.1rem, 4.2vw, 1.6rem); padding: .2em .8em; }
    .arc-cesta {
      position: absolute; bottom: 7%; transform: translateX(-50%); z-index: 3; line-height: 1; pointer-events: none;
      font-size: clamp(2.8rem, 9vw, 4.2rem); filter: drop-shadow(0 4px 0 rgba(35, 50, 74, .25));
    }

    .arc-globo {
      width: clamp(4.6rem, 17vw, 6.4rem); aspect-ratio: 5 / 6; padding: .25rem; cursor: pointer;
      border: 3px solid var(--tinta); border-radius: 50% 50% 48% 48% / 56% 56% 44% 44%; color: var(--tinta);
      background: var(--globo, var(--coral)); box-shadow: inset -8px -10px 0 rgba(35, 50, 74, .1);
      font: 800 clamp(.8rem, 2.6vw, 1.1rem)/1.1 var(--f-titulo); display: grid; place-items: center; text-wrap: balance;
    }
    .arc-globo::after { content: ''; position: absolute; left: 50%; top: 100%; width: 2px; height: 1.6rem; background: var(--tinta); }
    .arc-globo:hover { filter: brightness(1.07); }

    .arc-pez {
      display: inline-flex; align-items: center; gap: .45rem; max-width: 46%; cursor: pointer; text-align: left;
      background: var(--blanco); color: var(--tinta); border: 3px solid var(--tinta); border-radius: 999px;
      padding: .3rem .95rem; box-shadow: 0 3px 0 var(--tinta); font: 800 clamp(.8rem, 2.4vw, 1rem)/1.15 var(--f-titulo);
    }
    .arc-pez .arc-e { font-size: 1.8rem; line-height: 1; flex: none; }
    .arc-pez.arc-der { flex-direction: row-reverse; }
    .arc-pez.arc-der .arc-e { transform: scaleX(-1); }
    .arc-pez:hover { background: var(--sol-suave); }

    .arc-pausa {
      position: absolute; inset: 0; z-index: 10; display: grid; place-items: center;
      background: rgba(255, 255, 255, .78); font: 800 clamp(1.6rem, 5vw, 2.4rem) var(--f-titulo);
    }
    .arc-ctrl { display: flex; gap: 1rem; justify-content: center; margin-top: 1.1rem; }
    .arc-ctrl .btn { touch-action: none; min-width: 96px; }
  `,
})
export class ArcadeCampo {
  readonly fondo = input<'prado' | 'cielo' | 'mar' | 'granja'>('prado');
  readonly pausado = input(false);
  readonly flash = input<'' | 'ok' | 'mal'>('');
  /** Muestra los botones ◀ ▶ y deja mover la cesta con el mouse o el dedo. */
  readonly controles = input(false);
  /** Altura libre (sin proporción fija), para escenarios con mucho texto. */
  readonly libre = input(false);

  readonly pausar = output<void>();
  /** Posición horizontal del mouse o del dedo, de 0 a 100 (% del ancho del campo). */
  readonly punteroX = output<number>();
  /** Botones ◀ ▶: -1 izquierda, 1 derecha, 0 suelta. */
  readonly mover = output<number>();

  protected puntero(ev: PointerEvent): void {
    if (!this.controles()) return;
    const caja = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    if (caja.width) this.punteroX.emit(((ev.clientX - caja.left) / caja.width) * 100);
  }
}
