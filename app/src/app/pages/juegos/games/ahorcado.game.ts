import { Component, computed, HostListener, signal } from '@angular/core';
import { AUTORES, LEYENDAS, LIBROS, PERSONAJES } from '../../../core/data/banco-literario.data';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

type Tema = 'todos' | 'personajes' | 'autores' | 'libros' | 'leyendas';
interface Reto { w: string; pista: string; tipo: string; }
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_ERRORES = 6;

@Component({
  selector: 'app-ahorcado-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="El Ahorcado tico"
      mensaje="Adivina la palabra letra por letra antes de que se completen seis errores."
      aprendemos="Deletreo: pensar en las letras que forman cada palabra."
      boton="Comenzar" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <h3>¿Qué palabras adivinamos?</h3>
        <div class="selector">
          @for (t of temas; track t.id) {
            <button type="button" [attr.aria-pressed]="tema() === t.id" (click)="tema.set(t.id)"><strong>{{ t.titulo }}</strong></button>
          }
        </div>
      </div>
      @if (fase() === 'jugando' && reto(); as r) {
        <section class="tarjeta">
          <p class="progreso">Palabra {{ n() + 1 }} de {{ retos().length }} · Aciertos: {{ ganadas() }} · Errores: {{ errores() }}/{{ max }}</p>
          <div class="cuerpo">
            <svg viewBox="0 0 220 260" class="dibujo" aria-hidden="true">
              <g stroke="#23324a" stroke-width="6" stroke-linecap="round" fill="none">
                <line x1="20" y1="240" x2="150" y2="240"/><line x1="60" y1="240" x2="60" y2="20"/>
                <line x1="60" y1="20" x2="150" y2="20"/><line x1="150" y1="20" x2="150" y2="45"/>
                @if (errores() >= 1) { <circle cx="150" cy="65" r="20"/> }
                @if (errores() >= 2) { <line x1="150" y1="85" x2="150" y2="150"/> }
                @if (errores() >= 3) { <line x1="150" y1="100" x2="120" y2="130"/> }
                @if (errores() >= 4) { <line x1="150" y1="100" x2="180" y2="130"/> }
                @if (errores() >= 5) { <line x1="150" y1="150" x2="125" y2="195"/> }
                @if (errores() >= 6) { <line x1="150" y1="150" x2="175" y2="195"/> }
              </g>
            </svg>
            <div>
              <p class="nota">Es un(a) {{ r.tipo }}:</p>
              <div class="palabra" aria-live="polite">
                @for (ch of letrasPalabra(); track $index) {
                  @if (ch === ' ') { <span class="esp"></span> } @else { <span class="letra-p">{{ dichas().includes(ch) ? ch : '' }}</span> }
                }
              </div>
              <p class="pista">{{ r.pista }} <app-audio-btn [texto]="r.pista" /></p>
              <p class="mensaje" role="status">{{ mensaje() }}</p>
            </div>
          </div>
          <div class="teclado">
            @for (l of letras; track l) {
              <button type="button" class="tecla" [class.ok]="dichas().includes(l) && palabra().includes(l)"
                [class.bad]="dichas().includes(l) && !palabra().includes(l)" [disabled]="dichas().includes(l) || terminadaRonda()" (click)="jugar(l)">{{ l }}</button>
            }
          </div>
          @if (terminadaRonda()) {
            <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">{{ n() + 1 >= retos().length ? 'Ver resultado' : 'Siguiente palabra' }}</button>
          }
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .cuerpo { display: grid; gap: 1rem; grid-template-columns: 1fr; align-items: center; }
    @media (min-width: 700px) { .cuerpo { grid-template-columns: 220px 1fr; } }
    .dibujo { width: 200px; margin: 0 auto; }
    .palabra { display: flex; flex-wrap: wrap; gap: .4rem; margin: .4rem 0 1rem; }
    .letra-p { width: 2.4rem; height: 3rem; display: grid; place-items: center; border-bottom: 5px solid var(--tinta); font: 800 1.9rem var(--f-titulo); }
    .esp { width: 1.4rem; }
    .pista { display: flex; gap: .6rem; align-items: center; background: var(--sol-suave); border-radius: var(--radio-s); padding: .6rem 1rem; max-width: none; }
    .teclado { display: grid; grid-template-columns: repeat(auto-fit, minmax(46px, 1fr)); gap: .45rem; margin: 1rem 0; }
    .tecla { min-height: 52px; border-radius: 14px; border: 3px solid var(--tinta); background: var(--cielo-suave); font: 800 1.2rem var(--f-titulo); color: var(--tinta); cursor: pointer; }
    .tecla:hover:not(:disabled) { background: var(--sol); }
    .tecla.ok { background: var(--menta); } .tecla.bad { background: var(--coral); opacity: .7; }
    .tecla:disabled { cursor: default; }
  `,
})
export class AhorcadoGame extends JuegoBase {
  readonly slug = 'ahorcado';
  protected readonly letras = LETRAS;
  protected readonly max = MAX_ERRORES;
  protected readonly temas: { id: Tema; titulo: string }[] = [
    { id: 'todos', titulo: 'Todo mezclado' }, { id: 'personajes', titulo: 'Personajes' },
    { id: 'autores', titulo: 'Autores' }, { id: 'libros', titulo: 'Libros' }, { id: 'leyendas', titulo: 'Leyendas' },
  ];
  protected readonly tema = signal<Tema>('todos');
  protected readonly retos = signal<Reto[]>([]);
  protected readonly n = signal(0);
  protected readonly dichas = signal<string[]>([]);
  protected readonly errores = signal(0);
  protected readonly ganadas = signal(0);
  protected readonly terminadaRonda = signal(false);
  protected readonly mensaje = signal('');

  protected readonly reto = computed(() => this.retos()[this.n()] ?? null);
  protected readonly palabra = computed(() => this.limpia(this.reto()?.w ?? ''));
  protected readonly letrasPalabra = computed(() => this.palabra().split(''));

  private limpia(s: string): string {
    return this.banco.normalizar(s).replace(/Ñ/g, 'N').replace(/[^A-Z ]/g, '');
  }

  protected iniciar(): void {
    const t = this.tema();
    const b = this.banco;
    const src: Reto[] = [];
    if (t === 'todos' || t === 'personajes') b.filtrarOTodo(PERSONAJES).forEach((o) => src.push({ w: o.n, pista: o.p[0], tipo: 'personaje' }));
    if (t === 'todos' || t === 'autores') b.filtrarOTodo(AUTORES).forEach((o) => src.push({ w: o.n, pista: o.p[0], tipo: 'autor' }));
    if (t === 'todos' || t === 'libros') b.filtrarOTodo(LIBROS).forEach((o) => src.push({ w: o.t, pista: o.s, tipo: 'libro' }));
    if (t === 'todos' || t === 'leyendas') b.filtrarOTodo(LEYENDAS).forEach((o) => src.push({ w: o.n, pista: o.p[0], tipo: 'leyenda' }));
    this.retos.set(b.barajar(src).slice(0, 6));
    this.n.set(0);
    this.ganadas.set(0);
    this.nueva();
    this.empezar();
  }

  private nueva(): void {
    this.dichas.set([]);
    this.errores.set(0);
    this.terminadaRonda.set(false);
    this.mensaje.set('');
  }

  @HostListener('document:keydown', ['$event'])
  protected teclado(e: KeyboardEvent): void {
    if (this.fase() !== 'jugando' || e.ctrlKey || e.metaKey || e.altKey) return;
    const l = this.banco.normalizar(e.key).replace(/Ñ/g, 'N');
    if (l.length === 1 && LETRAS.includes(l)) this.jugar(l);
  }

  protected jugar(l: string): void {
    if (this.terminadaRonda() || this.dichas().includes(l)) return;
    this.dichas.update((d) => [...d, l]);
    if (this.palabra().includes(l)) this.efectos.click();
    else { this.errores.update((e) => e + 1); this.efectos.error(); }
    const completa = this.letrasPalabra().every((ch) => ch === ' ' || this.dichas().includes(ch));
    if (completa) {
      this.terminadaRonda.set(true);
      this.ganadas.update((g) => g + 1);
      this.mensaje.set(`¡Adivinaste! Era ${this.palabra()}.`);
      this.efectos.aplausos();
      this.efectos.confeti(50);
    } else if (this.errores() >= MAX_ERRORES) {
      this.terminadaRonda.set(true);
      this.mensaje.set(`Se acabaron los intentos. Era ${this.palabra()}.`);
    }
  }

  protected siguiente(): void {
    if (this.n() + 1 >= this.retos().length) {
      this.terminar(this.ganadas(), this.retos().length, `¡Adivinaste ${this.ganadas()} de ${this.retos().length}!`,
        this.ganadas() === this.retos().length ? '¡Perfecto! Nadie te detiene.' : '¡Buen trabajo! Sigue practicando.');
      return;
    }
    this.n.update((n) => n + 1);
    this.nueva();
  }
}
