import { Component, computed, signal } from '@angular/core';
import { PREGS as PREGS_PLACEHOLDER } from '../../../core/data/banco-literario.data';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { JuegoBase } from '../../../shared/utils/juego-base';
import { Pregunta } from '../../../core/models/banco.model';

const RANGOS = [
  'Lector curioso',
  'Amigo de los libros',
  'Explorador de historias',
  'Guardián de leyendas',
  'Cazador de palabras',
  'Cronista tico',
  'Emisario de cuentos',
  'Campeón de la lectura',
  'Sabio de las letras',
  'Ganador Literario',
];

@Component({
  selector: 'app-millonario-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="¡A ganar conocimiento!"
      mensaje="Diez preguntas de literatura costarricense; cada una te acerca a un rango más alto de Ganador Literario. Tienes tres comodines: 50/50, ayuda del público y cambiar pregunta."
      aprendemos="Repaso y estrategia. No hay premios en dinero: el premio es saber más de nuestros libros."
      boton="Empezar el juego" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && actual(); as q) {
        <section class="tarjeta">
          <p class="progreso">Pregunta {{ qi() + 1 }} de {{ banco10().length }} · Rango: {{ rangos[qi()] }}</p>
          <div class="pregunta-caja"><span class="texto">{{ q.p }}</span><app-audio-btn [texto]="q.p" /></div>
          <div class="fila">
            <button type="button" class="btn btn-cielo btn-mini" [disabled]="!com().c50 || bloqueado()" (click)="cincuenta()">50/50</button>
            <button type="button" class="btn btn-cielo btn-mini" [disabled]="!com().pub || bloqueado()" (click)="publico()">Público</button>
            <button type="button" class="btn btn-cielo btn-mini" [disabled]="!com().cambio || bloqueado()" (click)="cambiar()">Cambiar</button>
          </div>
          <div class="opciones espacio">
            @for (o of opciones(); track $index) {
              <button type="button" class="opcion-r" [disabled]="bloqueado() || quitadas().includes($index)"
                [class.ok]="bloqueado() && $index === resp()" [class.bad]="bloqueado() && $index === elegida() && $index !== resp()"
                [class.dim]="quitadas().includes($index)" (click)="responder($index)">
                <span class="letra">{{ ['A','B','C','D'][$index] }}</span>{{ o }}
              </button>
            }
          </div>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
          @if (continuar()) { <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">Continuar</button> }
        </section>
      }
    </app-game-shell>
  `,
  styles: `.espacio { margin-top: 1rem; }`,
})
export class MillonarioGame extends JuegoBase {
  readonly slug = 'millonario';
  protected readonly rangos = RANGOS;
  protected readonly banco10 = signal<Pregunta[]>([]);
  private reserva: Pregunta[] = [];
  protected readonly qi = signal(0);
  protected readonly com = signal({ c50: true, pub: true, cambio: true });
  protected readonly mezcla = signal<{ opciones: string[]; resp: number }>({ opciones: [], resp: 0 });
  protected readonly quitadas = signal<number[]>([]);
  protected readonly bloqueado = signal(false);
  protected readonly elegida = signal(-1);
  protected readonly continuar = signal(false);
  protected readonly mensaje = signal('');
  protected readonly actual = computed(() => this.banco10()[this.qi()] ?? null);
  protected readonly opciones = computed(() => this.mezcla().opciones);
  protected readonly resp = computed(() => this.mezcla().resp);

  protected iniciar(): void {
    const todas = this.banco.barajar(this.banco.filtrarOTodo(PREGS_PLACEHOLDER, 10));
    this.banco10.set(todas.slice(0, 10));
    this.reserva = todas.slice(10);
    this.qi.set(0);
    this.com.set({ c50: true, pub: true, cambio: true });
    this.mostrar();
    this.empezar();
  }

  private mostrar(): void {
    const q = this.actual()!;
    this.mezcla.set(this.banco.mezclar(q.o, q.r));
    this.quitadas.set([]);
    this.bloqueado.set(false);
    this.elegida.set(-1);
    this.continuar.set(false);
    this.mensaje.set('');
  }

  protected responder(i: number): void {
    this.bloqueado.set(true);
    this.elegida.set(i);
    if (i === this.resp()) {
      this.efectos.aplausos();
      this.efectos.confeti(40);
      this.mensaje.set('¡Correcto!');
      this.continuar.set(true);
    } else {
      this.efectos.error();
      this.mensaje.set('Incorrecto. La respuesta era: ' + this.opciones()[this.resp()] + '.');
      this.pausa(1500, () => this.fin(false));
    }
  }

  protected siguiente(): void {
    if (this.qi() + 1 >= this.banco10().length) { this.fin(true); return; }
    this.qi.update((q) => q + 1);
    this.mostrar();
  }

  protected cincuenta(): void {
    this.com.update((c) => ({ ...c, c50: false }));
    const malas = this.banco.barajar([0, 1, 2, 3].filter((i) => i !== this.resp())).slice(0, 2);
    this.quitadas.set(malas);
    this.avisos.toast('¡Quedan dos opciones!');
  }

  protected publico(): void {
    this.com.update((c) => ({ ...c, pub: false }));
    const correcta = 45 + Math.floor(Math.random() * 26);
    const resto = 100 - correcta;
    const otros = [0, 1, 2, 3].filter((i) => i !== this.resp());
    const a = Math.floor(Math.random() * (resto + 1));
    const b = Math.floor((resto - a) / 2);
    const pct: Record<number, number> = { [this.resp()]: correcta, [otros[0]]: a, [otros[1]]: b, [otros[2]]: resto - a - b };
    this.avisos.mostrarAviso('Ayuda del público', [0, 1, 2, 3].map((i) => `${'ABCD'[i]}: ${pct[i]}%`).join('   '), 'Entendido');
  }

  protected cambiar(): void {
    if (!this.reserva.length) { this.avisos.toast('No quedan preguntas de repuesto.'); return; }
    this.com.update((c) => ({ ...c, cambio: false }));
    this.banco10.update((l) => l.map((q, i) => (i === this.qi() ? this.reserva.pop()! : q)));
    this.mostrar();
    this.avisos.toast('¡Aquí va otra pregunta!');
  }

  private fin(gano: boolean): void {
    const buenas = gano ? this.banco10().length : this.qi();
    this.terminar(buenas, this.banco10().length,
      gano ? '¡Ganaste todo el conocimiento!' : `Llegaste a la pregunta ${this.qi() + 1}`,
      `Respondiste bien ${buenas} de ${this.banco10().length}. Rango alcanzado: ${buenas ? RANGOS[buenas - 1] : 'Empezando a leer'}.`);
  }
}
