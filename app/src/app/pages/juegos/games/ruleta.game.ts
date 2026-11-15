import { Component, signal } from '@angular/core';
import { ADIVINANZAS, PREGS } from '../../../core/data/banco-literario.data';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

interface Cat { k: string; pts: number; color: string; }
const CATS: Cat[] = [
  { k: 'Personajes', pts: 200, color: '#ff8a7a' }, { k: 'Libros', pts: 200, color: '#5bc0f8' },
  { k: 'Autores', pts: 300, color: '#b79cff' }, { k: 'Leyendas', pts: 150, color: '#7fe0b5' },
  { k: 'Adivinanzas', pts: 150, color: '#ffc93c' }, { k: 'Cultura', pts: 500, color: '#ff9fd0' },
];
const SEG = 360 / CATS.length;
const RONDAS = 6;

interface Tarjeta { cat: Cat; texto: string; opciones: string[]; resp: number; }

@Component({
  selector: 'app-ruleta-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="Ruleta literaria"
      mensaje="Gira la ruleta: cada color es un tema con sus puntos. Responde la pregunta que salga."
      aprendemos="Repaso por temas: libros, autores, personajes, leyendas y adivinanzas."
      boton="¡A girar!" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando') {
        <section class="tarjeta centro">
          <p class="progreso">Giro {{ ronda() + 1 }} de {{ total }} · Puntos: {{ puntos() }}</p>
          @if (!tarjeta()) {
            <div class="caja">
              <div class="flecha" aria-hidden="true"></div>
              <svg viewBox="0 0 200 200" class="rueda" aria-hidden="true">
                <g [style.transform]="'rotate(' + rot() + 'deg)'" [class.gira]="girando()" style="transform-origin: 100px 100px">
                  @for (c of cats; track c.k; let i = $index) {
                    <path [attr.d]="gajo(i)" [attr.fill]="c.color" stroke="#23324a" stroke-width="1.5"/>
                    <text [attr.x]="pos(i).x" [attr.y]="pos(i).y" text-anchor="middle" font-size="8.5" font-weight="800" fill="#23324a">{{ c.k }}</text>
                    <text [attr.x]="pos(i).x" [attr.y]="pos(i).y + 10" text-anchor="middle" font-size="8" fill="#23324a">{{ c.pts }} pts</text>
                  }
                </g>
                <circle cx="100" cy="100" r="13" fill="#fff" stroke="#23324a" stroke-width="3"/>
              </svg>
            </div>
            <button type="button" class="btn btn-coral btn-grande" [disabled]="girando()" (click)="girar()">¡Girar!</button>
          } @else if (tarjeta(); as t) {
            <p class="etiqueta-chip" [style.background]="t.cat.color">{{ t.cat.k }} · {{ t.cat.pts }} pts</p>
            <div class="pregunta-caja"><span class="texto">{{ t.texto }}</span><app-audio-btn [texto]="t.texto" /></div>
            <div class="opciones">
              @for (o of t.opciones; track $index) {
                <button type="button" class="opcion-r" [disabled]="elegida() >= 0"
                  [class.ok]="elegida() >= 0 && $index === t.resp" [class.bad]="elegida() === $index && $index !== t.resp"
                  [class.dim]="elegida() >= 0 && $index !== t.resp && $index !== elegida()" (click)="responder($index)">
                  <span class="letra">{{ ['A','B','C','D'][$index] }}</span>{{ o }}
                </button>
              }
            </div>
            <p class="mensaje" role="status">{{ mensaje() }}</p>
            @if (elegida() >= 0) { <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">{{ ronda() + 1 >= total ? 'Ver resultado' : 'Girar otra vez' }}</button> }
          }
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .caja { position: relative; width: min(100%, 380px); margin: .4rem auto 1.4rem; }
    .rueda { width: 100%; filter: drop-shadow(0 6px 0 rgba(35,50,74,.25)); }
    .gira { transition: transform 3.8s cubic-bezier(.2,.9,.25,1); }
    .flecha { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 30px solid var(--tinta); z-index: 2; }
    .etiqueta-chip { border: 2px solid var(--tinta); }
  `,
})
export class RuletaGame extends JuegoBase {
  readonly slug = 'ruleta';
  protected readonly cats = CATS;
  protected readonly total = RONDAS;
  protected readonly ronda = signal(0);
  protected readonly puntos = signal(0);
  protected readonly aciertos = signal(0);
  protected readonly rot = signal(0);
  protected readonly girando = signal(false);
  protected readonly tarjeta = signal<Tarjeta | null>(null);
  protected readonly elegida = signal(-1);
  protected readonly mensaje = signal('');

  protected gajo(i: number): string {
    const p = (a: number) => {
      const r = (a - 90) * Math.PI / 180;
      return `${100 + 92 * Math.cos(r)},${100 + 92 * Math.sin(r)}`;
    };
    return `M100,100 L${p(i * SEG)} A92,92 0 0 1 ${p((i + 1) * SEG)} Z`;
  }

  protected pos(i: number): { x: number; y: number } {
    const r = ((i + 0.5) * SEG - 90) * Math.PI / 180;
    return { x: 100 + 58 * Math.cos(r), y: 100 + 58 * Math.sin(r) - 3 };
  }

  protected iniciar(): void {
    this.ronda.set(0);
    this.puntos.set(0);
    this.aciertos.set(0);
    this.tarjeta.set(null);
    this.empezar();
  }

  protected girar(): void {
    if (this.girando()) return;
    this.girando.set(true);
    this.rot.update((r) => r + 1080 + Math.random() * 360);
    const tick = setInterval(() => this.efectos.giro(), 160);
    setTimeout(() => {
      clearInterval(tick);
      this.girando.set(false);
      const final = ((360 - (this.rot() % 360)) % 360);
      this.sacar(CATS[Math.floor(final / SEG) % CATS.length]);
    }, 3950);
  }

  private sacar(cat: Cat): void {
    this.efectos.aplausos();
    this.elegida.set(-1);
    this.mensaje.set('');
    if (cat.k === 'Adivinanzas') {
      const lista = this.banco.filtrarOTodo(ADIVINANZAS, 6);
      const a = this.banco.azar(lista);
      const otras = this.banco.barajar(ADIVINANZAS.filter((x) => x.a !== a.a)).slice(0, 3).map((x) => x.a);
      const m = this.banco.mezclar([a.a, ...otras], 0);
      this.tarjeta.set({ cat, texto: a.q, opciones: m.opciones, resp: m.resp });
      return;
    }
    let qs = this.banco.filtrarOTodo(PREGS).filter((x) => x.c === cat.k);
    if (!qs.length) qs = this.banco.filtrarOTodo(PREGS);
    const q = this.banco.azar(qs);
    const m = this.banco.mezclar(q.o, q.r);
    this.tarjeta.set({ cat, texto: q.p, opciones: m.opciones, resp: m.resp });
  }

  protected responder(i: number): void {
    const t = this.tarjeta()!;
    this.elegida.set(i);
    if (i === t.resp) {
      this.puntos.update((p) => p + t.cat.pts);
      this.aciertos.update((a) => a + 1);
      this.efectos.aplausos();
      this.efectos.confeti(40);
      this.mensaje.set(`¡Correcto! +${t.cat.pts} puntos.`);
    } else {
      this.efectos.error();
      this.mensaje.set('Casi. La respuesta era: ' + t.opciones[t.resp] + '.');
    }
  }

  protected siguiente(): void {
    if (this.ronda() + 1 >= RONDAS) {
      this.terminar(this.aciertos(), RONDAS, `¡Sumaste ${this.puntos()} puntos!`, `Acertaste ${this.aciertos()} de ${RONDAS} preguntas.`);
      return;
    }
    this.ronda.update((r) => r + 1);
    this.tarjeta.set(null);
  }
}
