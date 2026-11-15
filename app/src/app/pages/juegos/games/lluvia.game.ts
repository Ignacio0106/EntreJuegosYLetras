import { Component, computed, signal } from '@angular/core';
import { SILABAS } from '../../../core/data/banco-literario.data';
import { Silaba } from '../../../core/models/banco.model';
import { ArcadeCampo } from '../../../shared/components/arcade-campo/arcade-campo';
import { ArcadeVelocidad } from '../../../shared/components/arcade-campo/arcade-velocidad';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { ArcadeBase } from '../../../shared/utils/arcade-base';

interface Gota { id: number; x: number; y: number; v: number; texto: string; }

const PALABRAS = 5;
const LINEA_MIN = 76;
const LINEA_MAX = 94;

@Component({
  selector: 'app-lluvia-game',
  imports: [GameShell, ArcadeCampo, ArcadeVelocidad, AudioBtn],
  template: `
    <app-game-shell titulo="Lluvia de sílabas"
      mensaje="Llueven sílabas. Lee la pista y atrapa con la cesta las que forman la palabra, ¡en orden!"
      aprendemos="Dividir las palabras en sílabas y armarlas en el orden correcto."
      boton="¡Que llueva!" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <app-arcade-velocidad [(velocidad)]="velocidadId"
          nota="Se juega con el mouse, con el dedo o con las flechas ◀ ▶ del teclado. Puedes pausar cuando quieras." />
      </div>

      @if (fase() === 'jugando' && actual(); as p) {
        <section class="tarjeta">
          <p class="progreso">Palabra {{ idx() + 1 }} de {{ total }}</p>
          <div class="pregunta-caja">
            <span class="texto">{{ p.pista }}</span>
            <app-audio-btn [texto]="p.pista" />
          </div>
          <div class="slots" role="img" [attr.aria-label]="'Palabra de ' + p.sil.length + ' sílabas. Llevas ' + pos()">
            @for (s of p.sil; track $index; let i = $index) {
              <span class="slot" [class.llena]="i < pos()">{{ i < pos() ? s : '·' }}</span>
            }
          </div>
          <app-arcade-campo fondo="prado" [controles]="true" [pausado]="pausado()" [flash]="flash()"
            (pausar)="alternarPausa()" (punteroX)="ponerCesta($event)" (mover)="moverBoton($event)">
            <ng-container datos>
              <span>✅ {{ aciertos() }}</span><span>❌ {{ errores() }}</span>
            </ng-container>
            @for (g of items(); track g.id) {
              <span class="arc-item arc-chip arc-gota" [style.left.%]="g.x" [style.top.%]="g.y">{{ g.texto }}</span>
            }
            <span class="arc-cesta" [style.left.%]="cestaX()" aria-hidden="true">🧺</span>
          </app-arcade-campo>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .slots { display: flex; flex-wrap: wrap; gap: .6rem; justify-content: center; margin-bottom: 1.1rem; }
    .slot {
      min-width: 3.6rem; padding: .3rem .9rem; text-align: center; border: 3px dashed var(--linea);
      border-radius: var(--radio-s); font: 800 1.6rem var(--f-titulo);
    }
    .slot.llena { border: 3px solid var(--menta-fuerte); background: var(--menta-suave); }
  `,
})
export class LluviaGame extends ArcadeBase {
  readonly slug = 'lluvia';
  protected override usaCesta = true;

  protected readonly total = PALABRAS;
  protected readonly palabras = signal<Silaba[]>([]);
  protected readonly idx = signal(0);
  protected readonly pos = signal(0);
  protected readonly items = signal<Gota[]>([]);
  protected readonly aciertos = signal(0);
  protected readonly errores = signal(0);
  protected readonly actual = computed(() => this.palabras()[this.idx()] ?? null);

  private proximo = 0;
  private espera = 0;
  private sinNecesaria = 0;
  private todas: string[] = [];

  protected iniciar(): void {
    const lista = this.banco.filtrarOTodo(SILABAS, PALABRAS);
    this.palabras.set(this.banco.barajar(lista).slice(0, PALABRAS));
    this.todas = Array.from(new Set(lista.flatMap((s) => s.sil)));
    this.idx.set(0);
    this.pos.set(0);
    this.aciertos.set(0);
    this.errores.set(0);
    this.items.set([]);
    this.proximo = 0.5;
    this.espera = 0;
    this.sinNecesaria = 0;
    this.comenzar();
    this.mensaje.set('Atrapa la primera sílaba.');
  }

  protected tick(dt: number): void {
    // pausa corta entre palabra y palabra
    if (this.espera > 0) {
      this.espera -= dt;
      if (this.espera <= 0) {
        if (this.idx() + 1 >= this.palabras().length) {
          this.fin();
          return;
        }
        this.idx.update((i) => i + 1);
        this.pos.set(0);
        this.sinNecesaria = 0;
        this.proximo = 0.4;
        this.mensaje.set('Atrapa la primera sílaba.');
      }
      return;
    }
    const p = this.actual();
    if (!p) return;

    let lista = this.items();
    this.proximo -= dt;
    if (this.proximo <= 0) {
      lista = [...lista, this.crear(p.sil[this.pos()])];
      this.proximo = (1.0 + Math.random() * 0.5) / this.factor;
    }
    const x0 = this.cestaX();
    const quedan: Gota[] = [];
    for (const g of lista) {
      const y = g.y + g.v * this.factor * dt;
      const mitad = 12 + Math.min(6, g.texto.length * 1.2);
      if (y >= LINEA_MIN && y <= LINEA_MAX && Math.abs(g.x - x0) <= mitad) {
        if (this.atrapar(g, p)) return; // la palabra quedó completa
        continue;
      }
      if (y > 104) continue;
      quedan.push({ ...g, y });
    }
    this.items.set(quedan);
  }

  /** Casi la mitad de las sílabas son la que hace falta; así la lluvia nunca se vuelve injusta. */
  private crear(necesaria: string): Gota {
    let texto: string;
    if (this.sinNecesaria >= 2 || Math.random() < 0.45) {
      texto = necesaria;
      this.sinNecesaria = 0;
    } else {
      texto = this.banco.azar(this.todas.filter((s) => s !== necesaria));
      this.sinNecesaria++;
    }
    return { id: this.nuevoId(), x: 12 + Math.random() * 76, y: -6, v: 16 + Math.random() * 8, texto };
  }

  /** Devuelve true si con esta sílaba se completó la palabra. */
  private atrapar(g: Gota, p: Silaba): boolean {
    if (g.texto !== p.sil[this.pos()]) {
      this.errores.update((n) => n + 1);
      this.efectos.error();
      this.parpadeo('mal');
      this.mensaje.set(`«${g.texto}» todavía no. Fíjate en la pista.`);
      return false;
    }
    this.aciertos.update((n) => n + 1);
    this.pos.update((n) => n + 1);
    this.efectos.correcto();
    this.parpadeo('ok');
    if (this.pos() >= p.sil.length) {
      this.efectos.confeti(35);
      this.mensaje.set(`¡Armaste «${p.p}»!`);
      this.items.set([]);
      this.espera = 1.5;
      return true;
    }
    this.mensaje.set('¡Muy bien! Ahora la que sigue.');
    return false;
  }

  private fin(): void {
    const a = this.aciertos();
    const e = this.errores();
    this.terminar(
      a,
      a + e,
      '¡Armaste todas las palabras!',
      `Atrapaste ${a} ${a === 1 ? 'sílaba correcta' : 'sílabas correctas'} y te equivocaste ${e} ${e === 1 ? 'vez' : 'veces'}.`
    );
  }
}
