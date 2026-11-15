import { Component, computed, signal } from '@angular/core';
import { ORDEN } from '../../../core/data/banco-literario.data';
import { Historia } from '../../../core/models/banco.model';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

interface Paso { texto: string; orden: number; }

@Component({
  selector: 'app-ordenar-game',
  imports: [GameShell],
  template: `
    <app-game-shell titulo="Pon los pasos en orden"
      mensaje="Toca los pasos de la historia en el orden correcto. Si te equivocas, toca un paso de arriba para devolverlo."
      aprendemos="Secuencia narrativa: toda historia tiene un principio, un medio y un final."
      boton="Comenzar" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && historia(); as h) {
        <section class="tarjeta">
          <p class="progreso">Historia {{ n() + 1 }} de {{ historias().length }} · Intentos: {{ intentos() }}</p>
          <h2>{{ h.t }}</h2>
          <h3>Tu secuencia</h3>
          <div class="lista">
            @for (idx of secuencia(); track idx; let pos = $index) {
              <button type="button" class="paso sec" [class.ok]="revisado() && pasos()[idx].orden === pos"
                [class.bad]="revisado() && pasos()[idx].orden !== pos" (click)="devolver(pos)">
                <b>{{ pos + 1 }}.</b> {{ pasos()[idx].texto }}
              </button>
            } @empty { <p class="nota">Toca abajo el paso que va primero.</p> }
          </div>
          <h3>Pasos desordenados</h3>
          <div class="lista">
            @for (p of pasos(); track $index; let idx = $index) {
              @if (!secuencia().includes(idx)) { <button type="button" class="paso" (click)="elegir(idx)">{{ p.texto }}</button> }
            }
          </div>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
          <div class="fila">
            @if (!correcto()) {
              <button type="button" class="btn btn-sol btn-grande" (click)="revisar()">Revisar orden</button>
              <button type="button" class="btn btn-claro" (click)="cargar()">Barajar de nuevo</button>
            } @else {
              <button type="button" class="btn btn-menta btn-grande" (click)="siguiente()">{{ n() + 1 >= historias().length ? 'Ver resultado' : 'Otra historia' }}</button>
            }
          </div>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .lista { display: grid; gap: .6rem; margin: .5rem 0 1.2rem; }
    .paso { font: 600 1.05rem/1.4 var(--f-texto); text-align: left; padding: .8rem 1rem; border-radius: var(--radio-s); border: 3px solid var(--linea); background: #fff; cursor: pointer; min-height: 56px; color: var(--tinta); }
    .paso:hover { border-color: var(--cielo); background: var(--cielo-suave); }
    .paso.sec { border-color: var(--tinta); background: var(--sol-suave); }
    .paso.ok { background: var(--menta-suave); border-color: var(--menta-fuerte); }
    .paso.bad { background: var(--coral-suave); border-color: var(--coral-fuerte); }
  `,
})
export class OrdenarGame extends JuegoBase {
  readonly slug = 'ordenar';
  protected readonly historias = signal<Historia[]>([]);
  protected readonly n = signal(0);
  protected readonly pasos = signal<Paso[]>([]);
  protected readonly secuencia = signal<number[]>([]);
  protected readonly revisado = signal(false);
  protected readonly correcto = signal(false);
  protected readonly mensaje = signal('');
  protected readonly intentos = signal(0);
  protected readonly historia = computed(() => this.historias()[this.n()] ?? null);

  protected iniciar(): void {
    this.historias.set(this.banco.barajar(this.banco.filtrarOTodo(ORDEN)).slice(0, 3));
    this.n.set(0);
    this.intentos.set(0);
    this.cargar();
    this.empezar();
  }

  protected cargar(): void {
    const h = this.historia()!;
    this.pasos.set(this.banco.barajar(h.pasos.map((texto, orden) => ({ texto, orden }))));
    this.secuencia.set([]);
    this.revisado.set(false);
    this.correcto.set(false);
    this.mensaje.set('');
  }

  protected elegir(idx: number): void {
    if (this.correcto()) return;
    this.revisado.set(false);
    this.secuencia.update((s) => [...s, idx]);
    this.efectos.click();
  }

  protected devolver(pos: number): void {
    if (this.correcto()) return;
    this.revisado.set(false);
    this.secuencia.update((s) => s.filter((_, i) => i !== pos));
    this.efectos.click();
  }

  protected revisar(): void {
    if (this.secuencia().length !== this.pasos().length) {
      this.avisos.toast('Faltan pasos por ordenar.');
      return;
    }
    this.intentos.update((i) => i + 1);
    this.revisado.set(true);
    const bien = this.secuencia().every((idx, pos) => this.pasos()[idx].orden === pos);
    this.correcto.set(bien);
    if (bien) {
      this.efectos.aplausos();
      this.efectos.confeti(70);
      this.mensaje.set('¡Perfecto! La historia quedó en orden.');
      this.avisos.mostrarSabias();
    } else {
      this.efectos.error();
      this.mensaje.set('Algunos pasos están fuera de lugar (en rojo). ¡Inténtalo otra vez!');
    }
  }

  protected siguiente(): void {
    if (this.n() + 1 >= this.historias().length) {
      const total = this.historias().length;
      // menos intentos = más estrellas: con un intento por historia se llega a 100 %
      this.terminar(Math.min(total, total * total / Math.max(this.intentos(), 1)), total,
        '¡Ordenaste todas las historias!', `Lo lograste en ${this.intentos()} intentos. Cada historia tiene su orden.`);
      return;
    }
    this.n.update((n) => n + 1);
    this.cargar();
  }
}
