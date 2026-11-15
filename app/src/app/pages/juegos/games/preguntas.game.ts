import { Component, computed, signal } from '@angular/core';
import { LECTURAS_PREG } from '../../../core/data/banco-literario.data';
import { LecturaConPreguntas } from '../../../core/models/banco.model';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

@Component({
  selector: 'app-preguntas-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="Lee y comprende"
      mensaje="Aparece una lectura corta. Cuando termines de leer, toca «¡Ya leí!» y contesta las preguntas."
      aprendemos="Comprensión lectora: entender lo que se lee, recordar detalles y sacar conclusiones."
      boton="Comenzar a leer" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && lectura(); as l) {
        <section class="tarjeta">
          <p class="progreso">Lectura {{ li() + 1 }} de {{ lecturas().length }} · Aciertos: {{ aciertos() }} de {{ hechas() }}</p>
          @if (!leida()) {
            <div class="cab"><h2>{{ l.t }}</h2><app-audio-btn [texto]="l.t + '. ' + l.texto" /></div>
            <p class="nota">{{ l.fuente }}</p>
            <div class="lectura">{{ l.texto }}</div>
            <button type="button" class="btn btn-sol btn-grande" (click)="yaLeimos()">¡Ya leí!</button>
          } @else if (pregunta(); as q) {
            <div class="pregunta-caja"><span class="texto">{{ pi() + 1 }}. {{ q.p }}</span><app-audio-btn [texto]="q.p" /></div>
            <div class="opciones">
              @for (o of opciones(); track $index) {
                <button type="button" class="opcion-r" [disabled]="respondida()"
                  [class.ok]="respondida() && $index === resp()"
                  [class.bad]="respondida() && $index === elegida() && $index !== resp()"
                  [class.dim]="respondida() && $index !== resp() && $index !== elegida()" (click)="responder($index)">
                  <span class="letra">{{ ['A','B','C','D'][$index] }}</span>{{ o }}
                </button>
              }
            </div>
            <p class="mensaje" role="status">{{ mensaje() }}</p>
            @if (respondida()) {
              <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">Siguiente</button>
            }
          }
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .cab { display: flex; justify-content: space-between; align-items: center; gap: .8rem; }
    .lectura { background: var(--sol-suave); border-radius: var(--radio-s); padding: 1.3rem 1.5rem; font-size: 1.25rem; line-height: 1.8; margin: 1rem 0 1.4rem; white-space: pre-line; }
  `,
})
export class PreguntasGame extends JuegoBase {
  readonly slug = 'preguntas';
  protected readonly lecturas = signal<LecturaConPreguntas[]>([]);
  protected readonly li = signal(0);
  protected readonly pi = signal(0);
  protected readonly leida = signal(false);
  protected readonly aciertos = signal(0);
  protected readonly hechas = signal(0);
  protected readonly respondida = signal(false);
  protected readonly elegida = signal(-1);
  protected readonly mensaje = signal('');
  protected readonly mezcla = signal<{ opciones: string[]; resp: number }>({ opciones: [], resp: 0 });

  protected readonly lectura = computed(() => this.lecturas()[this.li()] ?? null);
  protected readonly pregunta = computed(() => this.lectura()?.preguntas[this.pi()] ?? null);
  protected readonly opciones = computed(() => this.mezcla().opciones);
  protected readonly resp = computed(() => this.mezcla().resp);

  protected iniciar(): void {
    this.lecturas.set(this.banco.barajar(this.banco.filtrarOTodo(LECTURAS_PREG)).slice(0, 4));
    this.li.set(0);
    this.aciertos.set(0);
    this.hechas.set(0);
    this.nuevaLectura();
    this.empezar();
  }

  private nuevaLectura(): void {
    this.pi.set(0);
    this.leida.set(false);
  }

  protected yaLeimos(): void {
    this.leida.set(true);
    this.prepararPregunta();
    this.efectos.click();
  }

  private prepararPregunta(): void {
    const q = this.pregunta();
    if (!q) return;
    this.mezcla.set(this.banco.mezclar(q.ops, q.r));
    this.respondida.set(false);
    this.elegida.set(-1);
    this.mensaje.set('');
  }

  protected responder(i: number): void {
    if (this.respondida()) return;
    this.respondida.set(true);
    this.elegida.set(i);
    this.hechas.update((h) => h + 1);
    if (i === this.resp()) {
      this.aciertos.update((a) => a + 1);
      this.efectos.aplausos();
      this.efectos.confeti(30);
      this.mensaje.set('¡Correcto!');
    } else {
      this.efectos.error();
      this.mensaje.set('Casi. La respuesta era: ' + this.opciones()[this.resp()] + '.');
    }
  }

  protected siguiente(): void {
    const l = this.lectura()!;
    if (this.pi() + 1 < l.preguntas.length) {
      this.pi.update((p) => p + 1);
      this.prepararPregunta();
      return;
    }
    if (l.dato) this.avisos.mostrarSabias(l.t, l.dato);
    if (this.li() + 1 >= this.lecturas().length) {
      this.terminar(this.aciertos(), this.hechas(), `¡Acertaste ${this.aciertos()} de ${this.hechas()} preguntas!`,
        'Leer y comprender es el primer paso para disfrutar los libros. ¡Sigue leyendo!');
      return;
    }
    this.li.update((n) => n + 1);
    this.nuevaLectura();
  }
}
