import { Component, computed, signal } from '@angular/core';
import { SILABAS } from '../../../core/data/banco-literario.data';
import { Silaba } from '../../../core/models/banco.model';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

interface Chip { sil: string; i: number; }

@Component({
  selector: 'app-silabas-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="Arma la palabra"
      mensaje="Toca las sílabas en el orden correcto para formar una palabra tica. Lee la pista si necesitas ayuda."
      aprendemos="Conciencia fonológica: separar y unir sílabas ayuda a leer con seguridad."
      boton="Comenzar" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && palabra(); as w) {
        <section class="tarjeta centro">
          <p class="progreso">Palabra {{ n() + 1 }} de {{ palabras().length }} · Completadas: {{ hechas() }}</p>
          <div class="pista"><b>Pista:</b> {{ w.pista }} <app-audio-btn [texto]="w.pista" /></div>
          <div class="slots" [class.mal]="mal()">
            @for (s of w.sil; track $index; let pos = $index) {
              <button type="button" class="slot" [class.lleno]="pos < construida().length" (click)="quitar(pos)">{{ construida()[pos]?.sil ?? '?' }}</button>
            }
          </div>
          <div class="fila centro chips">
            @for (c of chips(); track c.i) {
              <button type="button" class="btn btn-cielo btn-grande" [disabled]="usadas().includes(c.i) || ganada()" (click)="usar(c)">{{ c.sil }}</button>
            }
          </div>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
          <div class="fila centro">
            @if (!ganada()) { <button type="button" class="btn btn-claro" (click)="reiniciar()">Empezar la palabra otra vez</button> }
            @else { <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">{{ n() + 1 >= palabras().length ? 'Ver resultado' : 'Siguiente palabra' }}</button> }
          </div>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .pista { display: inline-flex; gap: .8rem; align-items: center; background: var(--sol-suave); border-radius: var(--radio-s); padding: .6rem 1rem; margin-bottom: 1.2rem; text-align: left; }
    .slots { display: flex; gap: .6rem; justify-content: center; margin: 1rem 0 1.4rem; flex-wrap: wrap; }
    .slot { min-width: 84px; min-height: 84px; border-radius: 22px; border: 3px dashed var(--tinta-suave); background: #fff; font: 800 2rem var(--f-titulo); color: var(--tinta-suave); cursor: pointer; }
    .slot.lleno { border: 3px solid var(--tinta); background: var(--menta); color: var(--tinta); }
    .mal .slot { animation: tiembla .4s; background: var(--coral-suave); border-color: var(--coral-fuerte); }
    .chips { margin-top: .6rem; }
    @keyframes tiembla { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
  `,
})
export class SilabasGame extends JuegoBase {
  readonly slug = 'silabas';
  protected readonly palabras = signal<Silaba[]>([]);
  protected readonly n = signal(0);
  protected readonly construida = signal<Chip[]>([]);
  protected readonly chips = signal<Chip[]>([]);
  protected readonly hechas = signal(0);
  protected readonly ganada = signal(false);
  protected readonly mal = signal(false);
  protected readonly mensaje = signal('');
  protected readonly palabra = computed(() => this.palabras()[this.n()] ?? null);
  protected readonly usadas = computed(() => this.construida().map((c) => c.i));

  protected iniciar(): void {
    this.palabras.set(this.banco.barajar(this.banco.filtrarOTodo(SILABAS)).slice(0, 8));
    this.n.set(0);
    this.hechas.set(0);
    this.cargar();
    this.empezar();
  }

  private cargar(): void {
    const w = this.palabra()!;
    this.chips.set(this.banco.barajar(w.sil.map((sil, i) => ({ sil, i }))));
    this.reiniciar();
    this.ganada.set(false);
  }

  protected reiniciar(): void {
    this.construida.set([]);
    this.mensaje.set('');
    this.efectos.click();
  }

  protected usar(c: Chip): void {
    if (this.usadas().includes(c.i)) return;
    this.construida.update((x) => [...x, c]);
    this.efectos.click();
    if (this.construida().length === this.palabra()!.sil.length) setTimeout(() => this.revisar(), 180);
  }

  protected quitar(pos: number): void {
    if (this.ganada()) return;
    this.construida.update((x) => x.filter((_, i) => i !== pos));
  }

  private revisar(): void {
    const w = this.palabra()!;
    if (this.construida().map((c) => c.sil).join('') === w.p) {
      this.ganada.set(true);
      this.hechas.update((h) => h + 1);
      this.mensaje.set(`¡Correcto! La palabra es «${w.p}».`);
      this.efectos.aplausos();
      this.efectos.confeti(40);
    } else {
      this.efectos.error();
      this.mal.set(true);
      this.mensaje.set('Así no queda. Toca una sílaba para quitarla o empieza otra vez.');
      setTimeout(() => this.mal.set(false), 600);
    }
  }

  protected siguiente(): void {
    if (this.n() + 1 >= this.palabras().length) {
      this.terminar(this.hechas(), this.palabras().length, `¡Armaste ${this.hechas()} de ${this.palabras().length} palabras!`,
        'Ahora busca esas palabras en un cuento y léelas en voz alta.');
      return;
    }
    this.n.update((n) => n + 1);
    this.cargar();
  }
}
