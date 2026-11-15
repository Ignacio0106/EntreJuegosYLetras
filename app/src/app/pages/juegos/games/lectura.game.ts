import { Component, computed, signal } from '@angular/core';
import { LECTURAS } from '../../../core/data/banco-literario.data';
import { Lectura } from '../../../core/models/banco.model';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

interface Opcion { texto: string; indice: number; }

@Component({
  selector: 'app-lectura-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="Completa el texto"
      mensaje="Un texto corto sobre nuestras letras tiene palabras en blanco. Lee y elige la palabra que mejor completa cada espacio."
      aprendemos="Vocabulario en contexto: las palabras cobran sentido dentro de la historia."
      boton="Comenzar a leer" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && actual(); as l) {
        <section class="tarjeta">
          <p class="progreso">Texto {{ ri() + 1 }} de {{ textos().length }} · Completados: {{ completados() }}</p>
          <div class="cab"><h2>«{{ l.t }}»</h2><app-audio-btn [texto]="textoLeible()" /></div>
          <p class="nota">{{ l.fuente }}</p>
          <p class="texto-hueco">
            @for (p of partes(); track $index; let i = $index) {
              {{ p }}@if (i < estado().length) {<span class="hueco" [class.lleno]="estado()[i] !== null" [class.activo]="estado()[i] === null && i === bi()">{{ estado()[i] ?? (i === bi() ? '?' : '____') }}</span>}
            }
          </p>
          @if (bi() < estado().length) {
            <p class="nota">Elige la palabra que falta:</p>
            <div class="fila">
              @for (o of opciones(); track o.indice) {
                <button type="button" class="btn btn-cielo" [class.mal]="malas().includes(o.indice)" [disabled]="malas().includes(o.indice)" (click)="elegir(o)">{{ o.texto }}</button>
              }
            </div>
          }
          <p class="mensaje" role="status">{{ mensaje() }}</p>
          @if (bi() >= estado().length) {
            <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">{{ ri() + 1 >= textos().length ? 'Ver resultado' : 'Siguiente texto' }}</button>
          }
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .cab { display: flex; justify-content: space-between; align-items: center; gap: .8rem; }
    .texto-hueco { background: var(--sol-suave); border-radius: var(--radio-s); padding: 1.3rem 1.5rem; font-size: 1.3rem; line-height: 2.2; max-width: none; }
    .hueco { display: inline-block; min-width: 4.5rem; text-align: center; border-bottom: 4px dashed var(--tinta-suave); margin: 0 .2rem; font-weight: 800; }
    .hueco.activo { border-bottom-color: var(--coral-fuerte); background: #fff; border-radius: 8px; }
    .hueco.lleno { border-bottom: 4px solid var(--menta-fuerte); color: var(--menta-fuerte); }
    .mal { text-decoration: line-through; }
  `,
})
export class LecturaGame extends JuegoBase {
  readonly slug = 'lectura';
  protected readonly textos = signal<Lectura[]>([]);
  protected readonly ri = signal(0);
  protected readonly bi = signal(0);
  protected readonly estado = signal<(string | null)[]>([]);
  protected readonly malas = signal<number[]>([]);
  protected readonly completados = signal(0);
  protected readonly mensaje = signal('');

  protected readonly actual = computed(() => this.textos()[this.ri()] ?? null);
  protected readonly partes = computed(() => this.actual()?.texto.split('{}') ?? []);
  protected readonly opciones = computed<Opcion[]>(() => {
    const l = this.actual();
    this.bi(); // se recalcula al avanzar de hueco
    if (!l || this.bi() >= l.opciones.length) return [];
    return this.banco.barajar(l.opciones[this.bi()].map((texto, indice) => ({ texto, indice })));
  });
  protected readonly textoLeible = computed(() => (this.actual()?.texto ?? '').replace(/\{\}/g, 'espacio en blanco'));

  protected iniciar(): void {
    this.textos.set(this.banco.barajar(this.banco.filtrarOTodo(LECTURAS)).slice(0, 6));
    this.ri.set(0);
    this.completados.set(0);
    this.cargar();
    this.empezar();
  }

  private cargar(): void {
    const l = this.actual()!;
    this.bi.set(0);
    this.malas.set([]);
    this.mensaje.set('');
    this.estado.set(l.texto.split('{}').slice(0, -1).map(() => null));
  }

  protected elegir(o: Opcion): void {
    const l = this.actual()!;
    if (o.indice === l.correctas[this.bi()]) {
      this.estado.update((e) => e.map((v, i) => (i === this.bi() ? o.texto : v)));
      this.bi.update((b) => b + 1);
      this.malas.set([]);
      this.efectos.correcto();
      this.efectos.confeti(15);
      if (this.bi() >= this.estado().length) {
        this.completados.update((c) => c + 1);
        this.mensaje.set('¡Texto completo! Léelo otra vez, ahora sí tiene sentido.');
        this.efectos.aplausos();
        if (l.dato) this.avisos.mostrarSabias(l.t, l.dato);
      } else {
        this.mensaje.set('¡Muy bien!');
      }
    } else {
      this.malas.update((m) => [...m, o.indice]);
      this.efectos.error();
      this.mensaje.set('Esa palabra no encaja. ¡Prueba otra!');
    }
  }

  protected siguiente(): void {
    if (this.ri() + 1 >= this.textos().length) {
      this.terminar(this.completados(), this.textos().length, `¡Leíste ${this.completados()} de ${this.textos().length} textos!`,
        'Cuéntale el cuento a alguien más. Contar es otra manera de leer.');
      return;
    }
    this.ri.update((r) => r + 1);
    this.cargar();
  }
}
