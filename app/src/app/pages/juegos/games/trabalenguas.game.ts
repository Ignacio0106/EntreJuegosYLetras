import { Component, OnDestroy, computed, signal } from '@angular/core';
import { TRABALENGUAS } from '../../../core/data/banco-literario.data';
import { Trabalengua } from '../../../core/models/banco.model';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

const SEGS = 25;

@Component({
  selector: 'app-trabalenguas-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="¡Dilo sin trabarte!"
      mensaje="Aparece un trabalenguas tico. Pulsa «Empezar el reto» y dilo en voz alta antes de que se acabe el tiempo."
      aprendemos="Fluidez y pronunciación: leer en voz alta con ritmo entrena la lengua y el oído."
      boton="Empezar" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && actual(); as t) {
        <section class="tarjeta centro">
          <p class="progreso">Trabalenguas {{ n() + 1 }} de {{ lista().length }} · Retos logrados: {{ logros() }}</p>
          <div class="trab" [class.activo]="corriendo()">{{ t.t }} <app-audio-btn [texto]="t.t" /></div>
          <div class="reloj" aria-live="off">{{ restante() }}</div>
          <div class="barra"><span [style.width.%]="restante() / seg * 100"></span></div>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
          <div class="fila centro">
            @if (!corriendo()) { <button type="button" class="btn btn-menta btn-grande" (click)="empezarReto()">Empezar el reto ({{ seg }} s)</button> }
            @if (corriendo() || tiempoAgotado()) { <button type="button" class="btn btn-sol btn-grande" (click)="logre()">¡Lo logré!</button> }
            <button type="button" class="btn btn-claro" (click)="otra()">{{ n() + 1 >= lista().length ? 'Terminar' : 'Otro trabalenguas' }}</button>
          </div>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .trab { font: 800 clamp(1.5rem, 4.5vw, 2.3rem)/1.4 var(--f-titulo); background: var(--coral-suave); border-radius: var(--radio-s); padding: 1.4rem; display: flex; gap: 1rem; align-items: center; justify-content: center; }
    .trab.activo { background: var(--sol-suave); }
    .reloj { font: 800 3.4rem var(--f-titulo); margin: .8rem 0 .2rem; }
    .barra { height: 16px; background: var(--linea); border-radius: 999px; overflow: hidden; max-width: 460px; margin: 0 auto; }
    .barra span { display: block; height: 100%; background: var(--menta-fuerte); transition: width .3s linear; }
  `,
})
export class TrabalenguasGame extends JuegoBase implements OnDestroy {
  readonly slug = 'trabalenguas';
  protected readonly seg = SEGS;
  protected readonly lista = signal<Trabalengua[]>([]);
  protected readonly n = signal(0);
  protected readonly logros = signal(0);
  protected readonly restante = signal(SEGS);
  protected readonly corriendo = signal(false);
  protected readonly tiempoAgotado = signal(false);
  protected readonly mensaje = signal('');
  protected readonly actual = computed(() => this.lista()[this.n()] ?? null);
  private reloj: ReturnType<typeof setInterval> | null = null;

  ngOnDestroy(): void { this.parar(); }

  protected iniciar(): void {
    this.lista.set(this.banco.barajar(this.banco.filtrarOTodo(TRABALENGUAS)).slice(0, 6));
    this.n.set(0);
    this.logros.set(0);
    this.reiniciarReto();
    this.empezar();
  }

  private reiniciarReto(): void {
    this.parar();
    this.restante.set(SEGS);
    this.tiempoAgotado.set(false);
    this.mensaje.set('Léelo en voz alta y sin trabarte. ¡Suerte!');
  }

  private parar(): void {
    if (this.reloj) clearInterval(this.reloj);
    this.reloj = null;
    this.corriendo.set(false);
  }

  protected empezarReto(): void {
    this.restante.set(SEGS);
    this.tiempoAgotado.set(false);
    this.corriendo.set(true);
    this.mensaje.set('¡Adelante, dilo ya!');
    this.reloj = setInterval(() => {
      this.restante.update((r) => r - 1);
      if (this.restante() <= 8) this.efectos.tic();
      if (this.restante() <= 0) {
        this.parar();
        this.tiempoAgotado.set(true);
        this.efectos.error();
        this.mensaje.set('¡Se acabó el tiempo! Si te salió, toca «¡Lo logré!».');
      }
    }, 1000);
  }

  protected logre(): void {
    const aTiempo = this.corriendo();
    this.parar();
    this.logros.update((l) => l + 1);
    this.tiempoAgotado.set(false);
    this.mensaje.set(aTiempo ? '¡Excelente! Lo dijiste completito y con tiempo de sobra.' : '¡Muy bien! Lo lograste.');
    this.efectos.aplausos();
    this.efectos.confeti(40);
  }

  protected otra(): void {
    this.parar();
    if (this.n() + 1 >= this.lista().length) {
      this.terminar(this.logros(), this.lista().length, `¡Lograste ${this.logros()} trabalenguas!`,
        'Los trabalenguas entrenan la lengua. Reta a alguien de tu casa.');
      return;
    }
    this.n.update((n) => n + 1);
    this.reiniciarReto();
  }
}
