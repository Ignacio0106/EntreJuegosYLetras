import { Component, signal } from '@angular/core';
import { REFRANES } from '../../../core/data/banco-literario.data';
import { Refran } from '../../../core/models/banco.model';
import { ArcadeCampo } from '../../../shared/components/arcade-campo/arcade-campo';
import { ArcadeVelocidad } from '../../../shared/components/arcade-campo/arcade-velocidad';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { ArcadeBase } from '../../../shared/utils/arcade-base';

interface Pez { id: number; x: number; y: number; v: number; dir: 1 | -1; texto: string; ok: boolean; }

const RONDAS = 8;

@Component({
  selector: 'app-pesca-game',
  imports: [GameShell, ArcadeCampo, ArcadeVelocidad, AudioBtn],
  template: `
    <app-game-shell titulo="Pesca el refrán"
      mensaje="Lee el principio del refrán y pesca el pez que trae el final correcto. ¡Los peces nunca se quedan quietos!"
      aprendemos="Completar refranes de nuestra sabiduría popular."
      boton="¡A pescar!" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <app-arcade-velocidad [(velocidad)]="velocidadId"
          nota="Toca o haz clic en el pez. Con el teclado: Tab para escoger el pez y Enter para pescarlo." />
      </div>

      @if (fase() === 'jugando' && refran(); as r) {
        <section class="tarjeta">
          <p class="progreso">Refrán {{ ronda() + 1 }} de {{ total }}</p>
          <div class="pregunta-caja">
            <span class="texto">{{ r.i }}</span>
            <app-audio-btn [texto]="r.i" />
          </div>
          <app-arcade-campo fondo="mar" [pausado]="pausado()" [flash]="flash()" (pausar)="alternarPausa()">
            <ng-container datos>
              <span>🎣 {{ puntosTexto() }} puntos</span>
            </ng-container>
            @for (p of items(); track p.id) {
              <button type="button" class="arc-item arc-pez" [class.arc-der]="p.dir === 1"
                [style.left.%]="p.x" [style.top.%]="p.y" (click)="pescar(p)">
                <span class="arc-e" aria-hidden="true">🐟</span>
                <span>{{ p.texto }}</span>
              </button>
            }
          </app-arcade-campo>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
        </section>
      }
    </app-game-shell>
  `,
})
export class PescaGame extends ArcadeBase {
  readonly slug = 'pesca';

  protected readonly total = RONDAS;
  protected readonly refranes = signal<Refran[]>([]);
  protected readonly ronda = signal(0);
  protected readonly items = signal<Pez[]>([]);
  protected readonly puntos = signal(0);

  private espera = 0;
  private erroresRonda = 0;

  protected refran(): Refran | null {
    return this.refranes()[this.ronda()] ?? null;
  }

  protected puntosTexto(): string {
    return String(this.puntos()).replace('.5', ' y medio');
  }

  protected iniciar(): void {
    const lista = this.banco.filtrarOTodo(REFRANES, RONDAS);
    this.refranes.set(this.banco.barajar(lista).slice(0, RONDAS));
    this.ronda.set(0);
    this.puntos.set(0);
    this.espera = 0;
    this.comenzar();
    this.lanzar();
  }

  private lanzar(): void {
    const r = this.refran();
    if (!r) return;
    // finales de otros refranes como distractores (sin repetir y sin el correcto)
    const pool = this.banco.filtrarOTodo(REFRANES, 4).map((x) => x.f).filter((f) => f !== r.f);
    const otros = this.banco.barajar(Array.from(new Set(pool))).slice(0, 3);
    const m = this.banco.mezclar([r.f, ...otros], 0);
    const carriles = this.banco.barajar([16, 38, 60, 82]);
    this.erroresRonda = 0;
    this.mensaje.set('');
    this.items.set(
      m.opciones.map((texto, i) => ({
        id: this.nuevoId(),
        x: 12 + Math.random() * 76,
        y: carriles[i % carriles.length],
        v: 8 + Math.random() * 7,
        dir: Math.random() < 0.5 ? 1 : -1,
        texto,
        ok: i === m.resp,
      }))
    );
  }

  protected tick(dt: number): void {
    if (this.espera > 0) {
      this.espera -= dt;
      if (this.espera <= 0) this.siguiente();
      return;
    }
    this.items.update((lista) =>
      lista.map((p) => {
        let x = p.x + p.dir * p.v * this.factor * dt;
        // al salir por un lado, el pez vuelve a entrar por el otro
        if (p.dir === 1 && x > 112) x = -12;
        if (p.dir === -1 && x < -12) x = 112;
        return { ...p, x };
      })
    );
  }

  protected pescar(p: Pez): void {
    if (this.espera > 0 || this.pausado()) return;
    const r = this.refran()!;
    if (p.ok) {
      const base = r.i.replace(/(\.{3}|…)\s*$/, '').trim();
      this.puntos.update((n) => n + (this.erroresRonda === 0 ? 1 : 0.5));
      this.efectos.correcto();
      this.efectos.confeti(25);
      this.parpadeo('ok');
      this.mensaje.set(`¡Pescado! ${base} ${r.f}.`);
      this.items.set([]);
      this.espera = 2;
    } else {
      this.erroresRonda++;
      this.efectos.error();
      this.parpadeo('mal');
      this.mensaje.set('Ese no completa el refrán. ¡Sigue pescando!');
      this.items.update((l) => l.filter((x) => x.id !== p.id));
    }
  }

  private siguiente(): void {
    if (this.ronda() + 1 >= RONDAS) {
      this.terminar(
        this.puntos(),
        RONDAS,
        '¡Gran pescador de refranes!',
        `Sumaste ${this.puntosTexto()} de ${RONDAS} puntos. Medio punto se gana si aciertas después de un error.`
      );
      return;
    }
    this.ronda.update((r) => r + 1);
    this.lanzar();
  }
}
