import { Component, signal } from '@angular/core';
import { RIMAS } from '../../../core/data/banco-literario.data';
import { Rima } from '../../../core/models/banco.model';
import { ArcadeCampo } from '../../../shared/components/arcade-campo/arcade-campo';
import { ArcadeVelocidad } from '../../../shared/components/arcade-campo/arcade-velocidad';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { ArcadeBase } from '../../../shared/utils/arcade-base';

interface Globo { id: number; bx: number; x: number; y: number; v: number; fase: number; texto: string; ok: boolean; color: string; }

const RONDAS = 8;
const COLORES = ['#ff8a7a', '#5bc0f8', '#ffc93c', '#7fe0b5', '#b79cff'];

@Component({
  selector: 'app-globos-game',
  imports: [GameShell, ArcadeCampo, ArcadeVelocidad, AudioBtn],
  template: `
    <app-game-shell titulo="Globos de rimas"
      mensaje="Suben globos con palabras. Revienta el que completa el verso y rima con el final. ¡Antes de que se escape!"
      aprendemos="Escuchar el sonido final de las palabras para encontrar la rima."
      boton="¡A reventar!" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <app-arcade-velocidad [(velocidad)]="velocidadId"
          nota="Toca o haz clic en el globo. Con el teclado: Tab para escoger el globo y Enter para reventarlo." />
      </div>

      @if (fase() === 'jugando' && rima(); as r) {
        <section class="tarjeta">
          <p class="progreso">Verso {{ ronda() + 1 }} de {{ total }}</p>
          <div class="pregunta-caja">
            <span class="texto">{{ r.verso }}</span>
            <app-audio-btn [texto]="r.verso" />
          </div>
          <app-arcade-campo fondo="cielo" [pausado]="pausado()" [flash]="flash()" (pausar)="alternarPausa()">
            <ng-container datos>
              <span>🎈 {{ puntosTexto() }} puntos</span>
            </ng-container>
            @for (g of items(); track g.id) {
              <button type="button" class="arc-item arc-globo" [style.left.%]="g.x" [style.top.%]="g.y"
                [style.--globo]="g.color" (click)="reventar(g)">{{ g.texto }}</button>
            }
          </app-arcade-campo>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
        </section>
      }
    </app-game-shell>
  `,
})
export class GlobosGame extends ArcadeBase {
  readonly slug = 'globos';

  protected readonly total = RONDAS;
  protected readonly rimas = signal<Rima[]>([]);
  protected readonly ronda = signal(0);
  protected readonly items = signal<Globo[]>([]);
  protected readonly puntos = signal(0);

  private espera = 0;
  private reloj = 0;
  private erroresRonda = 0;

  protected rima(): Rima | null {
    return this.rimas()[this.ronda()] ?? null;
  }

  protected puntosTexto(): string {
    return String(this.puntos()).replace('.5', ' y medio');
  }

  protected iniciar(): void {
    const lista = this.banco.filtrarOTodo(RIMAS, RONDAS);
    this.rimas.set(this.banco.barajar(lista).slice(0, RONDAS));
    this.ronda.set(0);
    this.puntos.set(0);
    this.espera = 0;
    this.reloj = 0;
    this.comenzar();
    this.lanzar();
  }

  private lanzar(): void {
    const r = this.rima();
    if (!r) return;
    const m = this.banco.mezclar(r.ops, r.r);
    const n = m.opciones.length;
    const xs = this.banco.barajar(Array.from({ length: n }, (_, i) => (100 * (i + 1)) / (n + 1)));
    this.erroresRonda = 0;
    this.mensaje.set('');
    this.items.set(
      m.opciones.map((texto, i) => ({
        id: this.nuevoId(),
        bx: xs[i],
        x: xs[i],
        y: 112 + i * 14, // salen escalonados
        v: 10 + Math.random() * 4,
        fase: Math.random() * 6,
        texto,
        ok: i === m.resp,
        color: COLORES[(i + this.ronda()) % COLORES.length],
      }))
    );
  }

  protected tick(dt: number): void {
    if (this.espera > 0) {
      this.espera -= dt;
      if (this.espera <= 0) this.siguiente();
      return;
    }
    this.reloj += dt;
    const quedan: Globo[] = [];
    let seEscapo = false;
    for (const g of this.items()) {
      const y = g.y - g.v * this.factor * dt;
      const x = Math.min(90, Math.max(10, g.bx + Math.sin(this.reloj * 1.6 + g.fase) * 3.5));
      if (y < -16) {
        if (g.ok) seEscapo = true;
        continue;
      }
      quedan.push({ ...g, x, y });
    }
    this.items.set(quedan);
    if (seEscapo) this.perdida();
  }

  private perdida(): void {
    const r = this.rima()!;
    this.efectos.error();
    this.mensaje.set(`Se escapó «${r.ops[r.r]}». ¡El próximo lo reventamos!`);
    this.items.set([]);
    this.espera = 1.8;
  }

  protected reventar(g: Globo): void {
    if (this.espera > 0 || this.pausado()) return;
    if (g.ok) {
      this.puntos.update((p) => p + (this.erroresRonda === 0 ? 1 : 0.5));
      this.efectos.correcto();
      this.efectos.confeti(25);
      this.parpadeo('ok');
      this.mensaje.set(`¡Rima perfecta con «${g.texto}»!`);
      this.items.set([]);
      this.espera = 1.5;
    } else {
      this.erroresRonda++;
      this.efectos.error();
      this.parpadeo('mal');
      this.mensaje.set('Esa no rima. ¡Prueba con otro globo!');
      this.items.update((l) => l.filter((x) => x.id !== g.id));
    }
  }

  private siguiente(): void {
    if (this.ronda() + 1 >= RONDAS) {
      const p = this.puntos();
      this.terminar(
        p,
        RONDAS,
        '¡Qué buenos oídos!',
        `Sumaste ${this.puntosTexto()} de ${RONDAS} puntos. Medio punto se gana si aciertas después de un error.`
      );
      return;
    }
    this.ronda.update((r) => r + 1);
    this.lanzar();
  }
}
