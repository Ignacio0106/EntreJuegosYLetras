import { Component, computed, signal } from '@angular/core';
import { AUTORES, LEYENDAS, PERSONAJES } from '../../../core/data/banco-literario.data';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

interface Misterio { tipo: string; nombre: string; libro?: string; pistas: string[]; }
type Cat = 'T' | 'P' | 'L' | 'A';
const RONDAS = 8;

@Component({
  selector: 'app-adivina-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="¿Quién será?"
      mensaje="Las pistas salen de una en una. Mientras menos pistas uses, más puntos ganas."
      aprendemos="Inferencia y atención: juntar pistas pequeñas para descubrir una respuesta."
      boton="Comenzar a adivinar" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <h3>¿Qué vamos a adivinar?</h3>
        <div class="selector">
          @for (c of categorias; track c.id) {
            <button type="button" [attr.aria-pressed]="cat() === c.id" (click)="cat.set(c.id)">
              <strong>{{ c.titulo }}</strong><small>{{ c.ayuda }}</small>
            </button>
          }
        </div>
      </div>
      @if (fase() === 'jugando' && actual(); as m) {
        <section class="tarjeta">
          <p class="progreso">Ronda {{ ronda() + 1 }} de {{ misterios().length }} · {{ m.tipo }} · Puntos: {{ puntos() }}</p>
          <div class="pistas">
            @for (p of pistasVisibles(); track $index) {
              <div class="pista"><span class="num">Pista {{ $index + 1 }}</span> {{ p }}<app-audio-btn [texto]="p" /></div>
            }
          </div>
          @if (!resuelta()) {
            <div class="fila"><button type="button" class="btn btn-cielo" [disabled]="pistas() >= m.pistas.length" (click)="otraPista()">Otra pista</button></div>
            <h3>¡Adivina!</h3>
            <div class="opciones">
              @for (o of opciones(); track o) {
                <button type="button" class="opcion-r" [class.bad]="malas().includes(o)" [disabled]="malas().includes(o)" (click)="elegir(o)">{{ o }}</button>
              }
            </div>
            <p class="nota">Con una pista valen 5 puntos; con dos, 4; y así hasta 1. Cada error resta un punto.</p>
            <button type="button" class="btn btn-claro btn-mini" (click)="revelar()">Revelar respuesta</button>
          } @else {
            <p class="mensaje" role="status">{{ resultado() }}</p>
            <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">{{ ronda() + 1 >= misterios().length ? 'Ver resultado' : 'Siguiente ronda' }}</button>
          }
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .pistas { display: grid; gap: .6rem; margin-bottom: 1rem; }
    .pista { display: flex; gap: .6rem; align-items: center; background: var(--cielo-suave); border-radius: var(--radio-s); padding: .7rem 1rem; font-weight: 600; }
    .pista .num { background: var(--sol); border-radius: 999px; padding: .1em .7em; font: 800 .85rem var(--f-titulo); white-space: nowrap; }
    .pista app-audio-btn { margin-left: auto; }
  `,
})
export class AdivinaGame extends JuegoBase {
  readonly slug = 'adivina';
  protected readonly categorias: { id: Cat; titulo: string; ayuda: string }[] = [
    { id: 'T', titulo: 'Mezclado', ayuda: 'Personajes, leyendas y autores' },
    { id: 'P', titulo: 'Personajes', ayuda: 'Tío Conejo, Cocorí y más' },
    { id: 'L', titulo: 'Leyendas', ayuda: 'La Segua, el Cadejos…' },
    { id: 'A', titulo: 'Autores', ayuda: 'Carmen Lyra, Calufa…' },
  ];
  protected readonly cat = signal<Cat>('T');
  protected readonly misterios = signal<Misterio[]>([]);
  private todos: Misterio[] = [];
  protected readonly ronda = signal(0);
  protected readonly pistas = signal(1);
  protected readonly malas = signal<string[]>([]);
  protected readonly opciones = signal<string[]>([]);
  protected readonly resuelta = signal(false);
  protected readonly resultado = signal('');
  protected readonly puntos = signal(0);
  protected readonly aciertos = signal(0);

  protected readonly actual = computed(() => this.misterios()[this.ronda()] ?? null);
  protected readonly pistasVisibles = computed(() => this.actual()?.pistas.slice(0, this.pistas()) ?? []);

  protected iniciar(): void {
    const c = this.cat();
    const pool: Misterio[] = [];
    if (c === 'T' || c === 'P') this.banco.filtrarOTodo(PERSONAJES).forEach((o) => pool.push({ tipo: 'Personaje', nombre: o.n, libro: o.l, pistas: o.p }));
    if (c === 'T' || c === 'L') this.banco.filtrarOTodo(LEYENDAS).forEach((o) => pool.push({ tipo: 'Leyenda', nombre: o.n, pistas: o.p }));
    if (c === 'T' || c === 'A') this.banco.filtrarOTodo(AUTORES).forEach((o) => pool.push({ tipo: 'Autor', nombre: o.n, pistas: o.p }));
    this.todos = pool;
    this.misterios.set(this.banco.barajar(pool).slice(0, RONDAS));
    this.ronda.set(0);
    this.puntos.set(0);
    this.aciertos.set(0);
    this.prepararRonda();
    this.empezar();
  }

  private prepararRonda(): void {
    const m = this.actual()!;
    const otros = this.banco.barajar(this.todos.filter((x) => x.nombre !== m.nombre)).slice(0, 3).map((x) => x.nombre);
    this.opciones.set(this.banco.barajar([m.nombre, ...otros]));
    this.pistas.set(1);
    this.malas.set([]);
    this.resuelta.set(false);
    this.resultado.set('');
  }

  protected otraPista(): void {
    this.pistas.update((p) => p + 1);
    this.efectos.giro();
  }

  protected elegir(nombre: string): void {
    const m = this.actual()!;
    if (nombre !== m.nombre) {
      this.malas.update((x) => [...x, nombre]);
      this.efectos.error();
      return;
    }
    const pts = Math.max(1, 6 - this.pistas() - this.malas().length);
    this.puntos.update((p) => p + pts);
    this.aciertos.update((a) => a + 1);
    this.resuelta.set(true);
    this.resultado.set(`¡Era ${m.nombre}! +${pts} puntos` + (m.libro ? ` (del libro «${m.libro}»)` : '.'));
    this.efectos.aplausos();
    this.efectos.confeti(40);
  }

  protected revelar(): void {
    const m = this.actual()!;
    this.resuelta.set(true);
    this.resultado.set(`La respuesta era ${m.nombre}` + (m.libro ? ` (del libro «${m.libro}»).` : '.') + ' ¡La próxima la sacas!');
  }

  protected siguiente(): void {
    if (this.ronda() + 1 >= this.misterios().length) {
      this.terminar(this.aciertos(), this.misterios().length, `¡Adivinaste ${this.aciertos()} de ${this.misterios().length}!`,
        `Sumaste ${this.puntos()} puntos. Los buenos detectives leen las pistas con calma.`);
      return;
    }
    this.ronda.update((r) => r + 1);
    this.prepararRonda();
  }
}
