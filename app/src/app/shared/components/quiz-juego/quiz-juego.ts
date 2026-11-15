import { Component, computed, input, signal } from '@angular/core';
import { JuegoBase } from '../../utils/juego-base';
import { AudioBtn } from '../audio-btn/audio-btn';
import { GameShell } from '../game-shell/game-shell';

export interface QuizItem {
  /** Texto pequeño sobre la pregunta (categoría, "¿Qué significa…?"). */
  etiqueta?: string;
  pregunta: string;
  opciones: string[];
  correcta: number;
  /** Se muestra después de responder (por ejemplo, cómo se usa una palabra). */
  extra?: string;
  /** Dato curioso que sale al acertar. */
  dato?: string;
}

export interface QuizConfig {
  slug: string;
  titulo: string;
  mensaje: string;
  aprendemos: string;
  boton: string;
  /** Devuelve las preguntas de la partida (ya barajadas y recortadas). */
  generar: () => QuizItem[];
  etiquetaProgreso: string;
  textoAcierto?: string;
  tituloFinal: (aciertos: number, total: number) => string;
  textoFinal: string;
  /** Mostrar la pregunta con letra muy grande (palabra suelta). */
  destacada?: boolean;
}

/** Juego de opción múltiple reutilizable: diccionario, rimas, verdadero o falso, etc. */
@Component({
  selector: 'app-quiz-juego',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell [titulo]="config().titulo" [mensaje]="config().mensaje" [aprendemos]="config().aprendemos"
      [boton]="config().boton" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && actual(); as it) {
        <section class="tarjeta">
          <p class="progreso">{{ config().etiquetaProgreso }} {{ indice() + 1 }} de {{ items().length }} · Aciertos: {{ aciertos() }}</p>
          @if (it.etiqueta) { <p class="nota">{{ it.etiqueta }}</p> }
          <div class="pregunta-caja" [class.destacada]="config().destacada">
            <span class="texto">{{ it.pregunta }}</span>
            <app-audio-btn [texto]="it.pregunta" />
          </div>
          <div class="opciones">
            @for (o of opciones(); track $index) {
              <button type="button" class="opcion-r" [disabled]="respondida()"
                [class.ok]="respondida() && $index === resp()"
                [class.bad]="respondida() && $index === elegida() && $index !== resp()"
                [class.dim]="respondida() && $index !== resp() && $index !== elegida()"
                (click)="responder($index)">
                <span class="letra">{{ letras[$index] }}</span>{{ o }}
              </button>
            }
          </div>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
          @if (respondida() && it.extra) { <p class="nota">{{ it.extra }}</p> }
          @if (respondida()) {
            <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">
              {{ indice() + 1 >= items().length ? 'Ver resultado' : 'Siguiente' }}
            </button>
          }
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .destacada { justify-content: center; text-align: center; font-size: clamp(2rem, 6vw, 3.2rem); }
    .destacada .texto { flex: 1; }
  `,
})
export class QuizJuego extends JuegoBase {
  readonly config = input.required<QuizConfig>();
  override get slug(): string { return this.config().slug; }

  protected readonly letras = ['A', 'B', 'C', 'D', 'E'];
  protected readonly items = signal<QuizItem[]>([]);
  protected readonly indice = signal(0);
  protected readonly aciertos = signal(0);
  protected readonly respondida = signal(false);
  protected readonly elegida = signal(-1);
  protected readonly mensaje = signal('');
  protected readonly mezcla = signal<{ opciones: string[]; resp: number }>({ opciones: [], resp: 0 });

  protected readonly actual = computed(() => this.items()[this.indice()] ?? null);
  protected readonly opciones = computed(() => this.mezcla().opciones);
  protected readonly resp = computed(() => this.mezcla().resp);

  protected iniciar(): void {
    this.items.set(this.config().generar());
    this.indice.set(0);
    this.aciertos.set(0);
    this.preparar();
    this.empezar();
  }

  private preparar(): void {
    const it = this.actual();
    if (!it) return;
    // Si las opciones son "Verdadero/Falso" no se barajan para no confundir.
    const fijas = it.opciones.length === 2;
    this.mezcla.set(
      fijas ? { opciones: it.opciones, resp: it.correcta } : this.banco.mezclar(it.opciones, it.correcta)
    );
    this.respondida.set(false);
    this.elegida.set(-1);
    this.mensaje.set('');
  }

  protected responder(i: number): void {
    if (this.respondida()) return;
    this.respondida.set(true);
    this.elegida.set(i);
    if (i === this.resp()) {
      this.aciertos.update((a) => a + 1);
      this.efectos.aplausos();
      this.efectos.confeti(30);
      this.mensaje.set(this.config().textoAcierto ?? '¡Correcto!');
      const dato = this.actual()?.dato;
      if (dato) this.avisos.mostrarSabias(undefined, dato);
    } else {
      this.efectos.error();
      this.mensaje.set('Casi. La respuesta era: ' + this.opciones()[this.resp()] + '.');
    }
  }

  protected siguiente(): void {
    if (this.indice() + 1 >= this.items().length) {
      const c = this.config();
      this.terminar(this.aciertos(), this.items().length, c.tituloFinal(this.aciertos(), this.items().length), c.textoFinal);
      return;
    }
    this.indice.update((i) => i + 1);
    this.preparar();
    this.efectos.click();
  }
}
