import { Component, signal } from '@angular/core';
import { VOF } from '../../../core/data/banco-literario.data';
import { ArcadeCampo } from '../../../shared/components/arcade-campo/arcade-campo';
import { ArcadeVelocidad } from '../../../shared/components/arcade-campo/arcade-velocidad';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { ArcadeBase } from '../../../shared/utils/arcade-base';

interface Topo { id: number; texto: string; verdad: boolean; arriba: boolean; mareado: boolean; }

const RONDAS = 8;
/** Cada topo sube y baja: está arriba SUBE segundos y escondido BAJA segundos. */
const SUBE = 3.4;
const BAJA = 1.1;
const TIEMPO_RONDA = 20;

@Component({
  selector: 'app-topos-game',
  imports: [GameShell, ArcadeCampo, ArcadeVelocidad],
  template: `
    <app-game-shell titulo="Topos de la verdad"
      mensaje="Los topos asoman con carteles. Lee con calma y dale al que dice lo que pide la consigna: ¡la verdad o la mentira!"
      aprendemos="Leer con atención y decidir si una afirmación sobre nuestros libros es verdadera o falsa."
      boton="¡A cazar topos!" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <app-arcade-velocidad [(velocidad)]="velocidadId"
          nota="Toca o haz clic en el topo. Con el teclado: Tab para escoger el topo y Enter para golpearlo." />
      </div>

      @if (fase() === 'jugando') {
        <section class="tarjeta">
          <p class="progreso">Ronda {{ ronda() + 1 }} de {{ total }}</p>
          <div class="pregunta-caja">
            <span class="texto">{{ buscaVerdad() ? '¡Dale al topo que dice la VERDAD!' : '¡Dale al topo que dice una MENTIRA!' }}</span>
          </div>
          <app-arcade-campo fondo="granja" [libre]="true" [pausado]="pausado()" [flash]="flash()" (pausar)="alternarPausa()">
            <ng-container datos>
              <span>⏱ {{ tiempo() }} s</span><span>🔨 {{ puntosTexto() }}</span>
            </ng-container>
            <div class="topos">
              @for (t of topos(); track t.id) {
                <div class="hoyo">
                  <button type="button" class="topo" [class.arriba]="t.arriba" [class.mareado]="t.mareado"
                    [disabled]="!t.arriba || t.mareado || pausado()" [attr.aria-hidden]="t.arriba ? null : 'true'"
                    [tabindex]="t.arriba ? 0 : -1" (click)="pegar(t)">
                    <span class="cartel">{{ t.texto }}</span>
                    <span class="cara" aria-hidden="true">{{ t.mareado ? '😵' : '🐹' }}</span>
                  </button>
                  <span class="monton" aria-hidden="true"></span>
                </div>
              }
            </div>
          </app-arcade-campo>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .topos { display: grid; grid-template-columns: repeat(3, 1fr); gap: .8rem; }
    @media (max-width: 640px) { .topos { grid-template-columns: 1fr; } }
    .hoyo { position: relative; height: 13rem; overflow: hidden; }
    @media (max-width: 640px) { .hoyo { height: 10.5rem; } }
    .topo {
      position: absolute; left: 50%; bottom: 1.5rem; width: 94%; display: flex; flex-direction: column; align-items: center;
      background: none; border: 0; padding: 0; cursor: pointer; color: var(--tinta);
      transform: translate(-50%, 115%); transition: transform .35s cubic-bezier(.3, 1.5, .5, 1);
    }
    .topo.arriba { transform: translate(-50%, 0); }
    .topo:disabled { cursor: default; }
    .cartel {
      background: var(--blanco); border: 3px solid var(--tinta); border-radius: var(--radio-s); padding: .45rem .7rem;
      font: 700 clamp(.85rem, 2.4vw, .98rem)/1.25 var(--f-texto); box-shadow: 0 3px 0 var(--tinta); text-wrap: balance;
    }
    .topo:not(:disabled):hover .cartel { background: var(--sol-suave); }
    .cara { font-size: 3.2rem; line-height: 1; margin-top: .15rem; }
    .topo.mareado .cartel { opacity: .55; }
    .monton {
      position: absolute; left: 4%; right: 4%; bottom: 0; height: 2.8rem; z-index: 2; pointer-events: none;
      background: #8a5a3c; border: 3px solid var(--tinta); border-radius: 50% / 60%;
    }
  `,
})
export class ToposGame extends ArcadeBase {
  readonly slug = 'topos';

  protected readonly total = RONDAS;
  protected readonly ronda = signal(0);
  protected readonly topos = signal<Topo[]>([]);
  protected readonly buscaVerdad = signal(true);
  protected readonly tiempo = signal(TIEMPO_RONDA);
  protected readonly puntos = signal(0);

  private espera = 0;
  private resto = TIEMPO_RONDA;
  private erroresRonda = 0;
  private fases: number[] = [];
  private usadas = new Set<string>();

  protected puntosTexto(): string {
    return String(this.puntos()).replace('.5', ' y medio');
  }

  protected iniciar(): void {
    this.ronda.set(0);
    this.puntos.set(0);
    this.espera = 0;
    this.usadas = new Set();
    this.comenzar();
    this.armar();
  }

  private armar(): void {
    const busca = Math.random() < 0.65;
    let todas = this.banco.filtrarOTodo(VOF);
    let verdades = todas.filter((x) => x.v);
    let falsas = todas.filter((x) => !x.v);
    if (verdades.length < 2 || falsas.length < 2) {
      todas = VOF;
      verdades = VOF.filter((x) => x.v);
      falsas = VOF.filter((x) => !x.v);
    }
    // sin repetir afirmaciones durante la partida (si se acaban, se vuelve a empezar)
    const libres = (l: typeof VOF) => {
      const f = l.filter((x) => !this.usadas.has(x.t));
      return f.length >= 2 ? f : l;
    };
    const correcta = this.banco.azar(libres(busca ? verdades : falsas));
    const distractores = this.banco.barajar(libres(busca ? falsas : verdades).filter((x) => x.t !== correcta.t)).slice(0, 2);
    [correcta, ...distractores].forEach((x) => this.usadas.add(x.t));

    const elegidas = this.banco.barajar([correcta, ...distractores]);
    this.buscaVerdad.set(busca);
    this.erroresRonda = 0;
    this.resto = TIEMPO_RONDA / this.factor;
    this.tiempo.set(Math.ceil(this.resto));
    this.mensaje.set('');
    // fases escalonadas para que siempre haya topos asomados
    this.fases = [0.2, 1.8, 3.4];
    this.topos.set(
      elegidas.map((x, i) => ({
        id: this.nuevoId(),
        texto: x.t,
        verdad: x.v,
        arriba: this.fases[i] % (SUBE + BAJA) < SUBE,
        mareado: false,
      }))
    );
  }

  protected tick(dt: number): void {
    if (this.espera > 0) {
      this.espera -= dt;
      if (this.espera <= 0) this.siguiente();
      return;
    }
    this.resto -= dt;
    this.tiempo.set(Math.max(0, Math.ceil(this.resto)));
    if (this.resto <= 0) {
      this.agotado();
      return;
    }
    // solo se actualiza la señal cuando algún topo cambia de estado (sube o baja)
    let cambio = false;
    const nuevos = this.topos().map((t, i) => {
      this.fases[i] += dt;
      const arriba = this.fases[i] % (SUBE + BAJA) < SUBE;
      if (arriba === t.arriba) return t;
      cambio = true;
      return { ...t, arriba };
    });
    if (cambio) this.topos.set(nuevos);
  }

  protected pegar(t: Topo): void {
    if (this.espera > 0 || this.pausado() || !t.arriba || t.mareado) return;
    if (t.verdad === this.buscaVerdad()) {
      this.puntos.update((p) => p + (this.erroresRonda === 0 ? 1 : 0.5));
      this.efectos.correcto();
      this.efectos.confeti(30);
      this.parpadeo('ok');
      this.mensaje.set(t.verdad ? '¡Sí! Ese topo decía la verdad.' : '¡Sí! Ese topo mentía.');
      this.espera = 1.8;
    } else {
      this.erroresRonda++;
      this.efectos.error();
      this.parpadeo('mal');
      this.mensaje.set(t.verdad ? 'Ese topo decía la verdad. ¡Busca otro!' : 'Ese topo mentía. ¡Busca otro!');
      this.topos.update((l) => l.map((x) => (x.id === t.id ? { ...x, mareado: true } : x)));
    }
  }

  private agotado(): void {
    this.efectos.error();
    this.mensaje.set('¡Se acabó el tiempo! Este era el topo correcto.');
    // se muestra el topo correcto
    this.topos.update((l) => l.map((x) => ({ ...x, arriba: x.verdad === this.buscaVerdad(), mareado: false })));
    this.espera = 2.4;
  }

  private siguiente(): void {
    if (this.ronda() + 1 >= RONDAS) {
      this.terminar(
        this.puntos(),
        RONDAS,
        '¡Buen ojo, cazador!',
        `Sumaste ${this.puntosTexto()} de ${RONDAS} puntos. Medio punto se gana si aciertas después de un error.`
      );
      return;
    }
    this.ronda.update((r) => r + 1);
    this.armar();
  }
}
