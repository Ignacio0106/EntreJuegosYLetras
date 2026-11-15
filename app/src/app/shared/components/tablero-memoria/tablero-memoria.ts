import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AvisosService } from '../../../core/services/avisos.service';
import { BancoService } from '../../../core/services/banco.service';
import { EfectosService } from '../../../core/services/efectos.service';

export interface Pareja { l: string; r: string; }
interface Carta { pareja: number; lado: 'l' | 'r'; texto: string; }

/** Tablero de parejas (memoria). Cada vez que cambia `parejas` se reparte de nuevo. */
@Component({
  selector: 'app-tablero-memoria',
  template: `
    <p class="progreso">Parejas: {{ aciertos() }} de {{ total() }} · Intentos: {{ intentos() }}</p>
    <div class="grid">
      @for (c of cartas(); track $index) {
        <button type="button" class="carta" [class.up]="visible($index)" [class.hecha]="hechas().has(c.pareja)"
          [attr.aria-label]="visible($index) ? c.texto : 'Carta boca abajo'" (click)="voltear($index)">
          <span class="cara dorso" aria-hidden="true">?</span>
          <span class="cara frente">{{ c.texto }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .8rem; }
    @media (max-width: 560px) { .grid { grid-template-columns: repeat(3, 1fr); } }
    .carta { position: relative; min-height: 112px; border: 0; background: none; padding: 0; cursor: pointer; perspective: 700px; font: inherit; }
    .cara {
      position: absolute; inset: 0; display: grid; place-items: center; padding: .5rem; text-align: center;
      border: 3px solid var(--tinta); border-radius: 20px; backface-visibility: hidden; transition: transform .35s;
      font: 700 .95rem/1.25 var(--f-texto); overflow-wrap: anywhere;
    }
    .dorso { color: var(--tinta); background: var(--cielo); font: 800 2.2rem var(--f-titulo); box-shadow: 0 5px 0 var(--tinta); }
    .frente { background: var(--blanco); transform: rotateY(180deg); }
    .carta.up .dorso { transform: rotateY(180deg); }
    .carta.up .frente { transform: rotateY(0); }
    .carta.hecha .frente { background: var(--menta-suave); border-color: var(--menta-fuerte); }
    .carta:hover:not(.up) .dorso { background: var(--sol); }
  `,
})
export class TableroMemoria {
  private readonly banco = inject(BancoService);
  private readonly efectos = inject(EfectosService);
  private readonly avisos = inject(AvisosService);

  readonly parejas = input.required<Pareja[]>();
  readonly terminado = output<number>();

  protected readonly cartas = signal<Carta[]>([]);
  protected readonly volteadas = signal<number[]>([]);
  protected readonly hechas = signal(new Set<number>());
  protected readonly aciertos = signal(0);
  protected readonly intentos = signal(0);
  protected readonly total = signal(0);
  private bloqueado = false;

  constructor() {
    effect(() => this.repartir(this.parejas()));
  }

  private repartir(parejas: Pareja[]): void {
    const cartas: Carta[] = parejas.flatMap((p, i) => [
      { pareja: i, lado: 'l' as const, texto: p.l },
      { pareja: i, lado: 'r' as const, texto: p.r },
    ]);
    this.cartas.set(this.banco.barajar(cartas));
    this.volteadas.set([]);
    this.hechas.set(new Set());
    this.aciertos.set(0);
    this.intentos.set(0);
    this.total.set(parejas.length);
    this.bloqueado = false;
  }

  protected visible(i: number): boolean {
    return this.volteadas().includes(i) || this.hechas().has(this.cartas()[i].pareja);
  }

  protected voltear(i: number): void {
    if (this.bloqueado || this.visible(i)) return;
    this.volteadas.update((v) => [...v, i]);
    this.efectos.click();
    if (this.volteadas().length < 2) return;
    const [a, b] = this.volteadas().map((x) => this.cartas()[x]);
    this.intentos.update((n) => n + 1);
    if (a.pareja === b.pareja && a.lado !== b.lado) {
      this.hechas.update((h) => new Set(h).add(a.pareja));
      this.aciertos.update((n) => n + 1);
      this.volteadas.set([]);
      this.efectos.correcto();
      if (this.aciertos() % 3 === 0 && this.aciertos() < this.total()) this.avisos.mostrarSabias();
      if (this.aciertos() === this.total()) setTimeout(() => this.terminado.emit(this.intentos()), 700);
    } else {
      this.efectos.error();
      this.bloqueado = true;
      setTimeout(() => {
        this.volteadas.set([]);
        this.bloqueado = false;
      }, 900);
    }
  }
}
