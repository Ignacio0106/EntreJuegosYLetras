import { Component, signal } from '@angular/core';
import { AUTORES, LIBROS, PERSONAJES } from '../../../core/data/banco-literario.data';
import { ArcadeCampo } from '../../../shared/components/arcade-campo/arcade-campo';
import { ArcadeVelocidad } from '../../../shared/components/arcade-campo/arcade-velocidad';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { ArcadeBase } from '../../../shared/utils/arcade-base';

type MisionId = 'personajes' | 'autores' | 'libros';
interface Mision { id: MisionId; icono: string; titulo: string; ayuda: string; uno: string; }
interface Caida { id: number; x: number; y: number; v: number; texto: string; bueno: boolean; }

const MISIONES: Mision[] = [
  { id: 'personajes', icono: '🦊', titulo: 'Personajes', ayuda: 'Atrapa los nombres de personajes de cuentos', uno: 'un personaje' },
  { id: 'autores', icono: '✍️', titulo: 'Autores', ayuda: 'Atrapa los nombres de quienes escriben', uno: 'un autor o una autora' },
  { id: 'libros', icono: '📚', titulo: 'Libros', ayuda: 'Atrapa los títulos de libros', uno: 'un libro' },
];
const DURACION = 45;
/** Altura (en % del campo) donde la cesta puede atrapar. */
const LINEA_MIN = 76;
const LINEA_MAX = 94;

@Component({
  selector: 'app-atrapa-game',
  imports: [GameShell, ArcadeCampo, ArcadeVelocidad],
  template: `
    <app-game-shell titulo="Atrapa la palabra"
      mensaje="Mueve la cesta y atrapa solo las palabras que pide tu misión. Las demás, ¡déjalas caer!"
      aprendemos="Reconocer rápido personajes, autores y libros de nuestra literatura."
      boton="¡A atrapar!" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <h3>Elige tu misión</h3>
        <div class="selector">
          @for (m of misiones; track m.id) {
            <button type="button" [attr.aria-pressed]="mision() === m.id" (click)="mision.set(m.id)">
              <strong>{{ m.icono }} {{ m.titulo }}</strong><small>{{ m.ayuda }}</small>
            </button>
          }
        </div>
        <app-arcade-velocidad [(velocidad)]="velocidadId"
          nota="Se juega con el mouse, con el dedo o con las flechas ◀ ▶ del teclado. Puedes pausar cuando quieras." />
      </div>

      @if (fase() === 'jugando') {
        <section class="tarjeta">
          <p class="progreso">Misión: atrapa solo {{ actual().titulo.toLowerCase() }} {{ actual().icono }}</p>
          <app-arcade-campo fondo="prado" [controles]="true" [pausado]="pausado()" [flash]="flash()"
            (pausar)="alternarPausa()" (punteroX)="ponerCesta($event)" (mover)="moverBoton($event)">
            <ng-container datos>
              <span>⏱ {{ tiempo() }} s</span><span>✅ {{ aciertos() }}</span>
            </ng-container>
            @for (c of items(); track c.id) {
              <span class="arc-item arc-chip" [style.left.%]="c.x" [style.top.%]="c.y">{{ c.texto }}</span>
            }
            <span class="arc-cesta" [style.left.%]="cestaX()" aria-hidden="true">🧺</span>
          </app-arcade-campo>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
        </section>
      }
    </app-game-shell>
  `,
})
export class AtrapaGame extends ArcadeBase {
  readonly slug = 'atrapa';
  protected override usaCesta = true;

  protected readonly misiones = MISIONES;
  protected readonly mision = signal<MisionId>('personajes');
  protected readonly items = signal<Caida[]>([]);
  protected readonly aciertos = signal(0);
  protected readonly fallos = signal(0);
  protected readonly perdidos = signal(0);
  protected readonly tiempo = signal(DURACION);

  private resto = DURACION;
  private proximo = 0;
  private buenos: string[] = [];
  private malos: string[] = [];
  private recientes: string[] = [];

  protected actual(): Mision {
    return MISIONES.find((m) => m.id === this.mision()) ?? MISIONES[0];
  }

  protected iniciar(): void {
    const b = this.banco;
    const personajes = b.filtrarOTodo(PERSONAJES).map((p) => p.n);
    const autores = b.filtrarOTodo(AUTORES).map((a) => a.n);
    const libros = b.filtrarOTodo(LIBROS).map((l) => l.t);
    const m = this.mision();
    this.buenos = m === 'personajes' ? personajes : m === 'autores' ? autores : libros;
    const otros = [
      ...(m !== 'personajes' ? personajes : []),
      ...(m !== 'autores' ? autores : []),
      ...(m !== 'libros' ? libros : []),
    ];
    // si un nombre sirve para dos misiones (p. ej. «Cocorí»), no se usa como distractor
    this.malos = otros.filter((x) => !this.buenos.includes(x));
    this.recientes = [];
    this.resto = DURACION;
    this.proximo = 0.4;
    this.tiempo.set(DURACION);
    this.aciertos.set(0);
    this.fallos.set(0);
    this.perdidos.set(0);
    this.items.set([]);
    this.comenzar();
    this.mensaje.set('¡Mueve la cesta!');
  }

  protected tick(dt: number): void {
    this.resto -= dt;
    this.tiempo.set(Math.max(0, Math.ceil(this.resto)));
    if (this.resto <= 0) {
      this.fin();
      return;
    }
    let lista = this.items();
    this.proximo -= dt;
    if (this.proximo <= 0) {
      lista = [...lista, this.crear()];
      this.proximo = (1.15 + Math.random() * 0.55) / this.factor;
    }
    const x0 = this.cestaX();
    const quedan: Caida[] = [];
    for (const c of lista) {
      const y = c.y + c.v * this.factor * dt;
      // las palabras largas son más anchas, así que se les da un poco más de margen
      const mitad = 10 + Math.min(10, c.texto.length * 0.35);
      if (y >= LINEA_MIN && y <= LINEA_MAX && Math.abs(c.x - x0) <= mitad) {
        this.atrapar(c);
        continue;
      }
      if (y > 104) {
        if (c.bueno) this.perdidos.update((n) => n + 1);
        continue;
      }
      quedan.push({ ...c, y });
    }
    this.items.set(quedan);
  }

  private crear(): Caida {
    const bueno = Math.random() < 0.55;
    const pool = bueno ? this.buenos : this.malos;
    let texto = this.banco.azar(pool);
    for (let i = 0; i < 4 && this.recientes.includes(texto); i++) texto = this.banco.azar(pool);
    this.recientes = [...this.recientes.slice(-4), texto];
    return { id: this.nuevoId(), x: 14 + Math.random() * 72, y: -6, v: 17 + Math.random() * 9, texto, bueno };
  }

  private atrapar(c: Caida): void {
    const uno = this.actual().uno;
    if (c.bueno) {
      this.aciertos.update((n) => n + 1);
      this.efectos.correcto();
      this.parpadeo('ok');
      this.mensaje.set(`¡Muy bien! «${c.texto}» es ${uno}.`);
    } else {
      this.fallos.update((n) => n + 1);
      this.efectos.error();
      this.parpadeo('mal');
      this.mensaje.set(`«${c.texto}» no es ${uno}. ¡Esas déjalas caer!`);
    }
  }

  private fin(): void {
    const a = this.aciertos();
    const f = this.fallos();
    const p = this.perdidos();
    this.terminar(
      a,
      a + f + p,
      `¡Atrapaste ${a}!`,
      `Atrapaste ${a} ${a === 1 ? 'palabra correcta' : 'palabras correctas'}, te equivocaste ${f} ${f === 1 ? 'vez' : 'veces'} y se escaparon ${p}.`
    );
  }
}
