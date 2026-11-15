import { Component, computed, signal } from '@angular/core';
import { ERRORES } from '../../../core/data/banco-literario.data';
import { FraseConErrores } from '../../../core/models/banco.model';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

type Estado = 'normal' | 'sel' | 'ok' | 'falta' | 'bad';

const limpiar = (s: string) => s.replace(/[.,;:¡!¿?«»"()\u201c\u201d]/g, '').toLowerCase();

@Component({
  selector: 'app-errores-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="¡A cazar errores!"
      mensaje="En cada frase hay palabras mal escritas. Tócalas y luego pulsa «Revisar». ¡Cuidado con las que están bien!"
      aprendemos="Reglas de escritura: fijarse en cómo se escriben las palabras nos hace mejores lectores."
      boton="Comenzar la cacería" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && frase(); as f) {
        <section class="tarjeta">
          <p class="progreso">Frase {{ n() + 1 }} de {{ frases().length }} · Bien cazadas: {{ bien() }}</p>
          <div class="frase">
            @for (t of tokens(); track $index) {
              <button type="button" class="pal" [class]="'pal ' + estadoDe($index)" [disabled]="revisada()" (click)="marcar($index)">{{ t }}</button>
            }
            <app-audio-btn [texto]="f.texto" etiqueta="Escuchar la frase" />
          </div>
          <p class="mensaje" role="status">{{ mensaje() }}</p>
          @if (revisada() && f.pista) { <p class="nota">💡 {{ f.pista }}</p> }
          <div class="fila">
            @if (!revisada()) {
              <button type="button" class="btn btn-claro" (click)="marcas.set([])">Limpiar marcas</button>
              <button type="button" class="btn btn-menta btn-grande" (click)="revisar()">Revisar</button>
            } @else {
              <button type="button" class="btn btn-sol btn-grande" (click)="siguiente()">{{ n() + 1 >= frases().length ? 'Ver resultado' : 'Siguiente frase' }}</button>
            }
          </div>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .frase { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; background: var(--cielo-suave); border-radius: var(--radio-s); padding: 1.2rem; font-size: 1.4rem; }
    .pal { font: 700 1.3rem var(--f-titulo); color: var(--tinta); background: #fff; border: 3px solid transparent; border-radius: 14px; padding: .25em .6em; min-height: 48px; cursor: pointer; }
    .pal:hover:not(:disabled) { border-color: var(--cielo); }
    .pal.sel { border-color: var(--tinta); background: var(--sol); }
    .pal.ok { background: var(--menta); border-color: var(--menta-fuerte); }
    .pal.falta { background: var(--sol-suave); border: 3px dashed var(--coral-fuerte); }
    .pal.bad { background: var(--coral-suave); border-color: var(--coral-fuerte); text-decoration: line-through; }
    .pal:disabled { cursor: default; }
  `,
})
export class ErroresGame extends JuegoBase {
  readonly slug = 'errores';
  protected readonly frases = signal<FraseConErrores[]>([]);
  protected readonly n = signal(0);
  protected readonly marcas = signal<number[]>([]);
  protected readonly revisada = signal(false);
  protected readonly bien = signal(0);
  protected readonly mensaje = signal('');

  protected readonly frase = computed(() => this.frases()[this.n()] ?? null);
  protected readonly tokens = computed(() => this.frase()?.texto.split(' ') ?? []);
  private readonly malos = computed(() => (this.frase()?.errores ?? []).map((e) => limpiar(e.mal)));

  protected iniciar(): void {
    this.frases.set(this.banco.barajar(this.banco.filtrarOTodo(ERRORES)).slice(0, 8));
    this.n.set(0);
    this.bien.set(0);
    this.nueva();
    this.empezar();
  }

  private nueva(): void {
    this.marcas.set([]);
    this.revisada.set(false);
    this.mensaje.set('');
  }

  protected marcar(i: number): void {
    this.marcas.update((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]));
    this.efectos.click();
  }

  protected estadoDe(i: number): Estado {
    const esError = this.malos().includes(limpiar(this.tokens()[i]));
    const marcado = this.marcas().includes(i);
    if (!this.revisada()) return marcado ? 'sel' : 'normal';
    if (esError && marcado) return 'ok';
    if (esError) return 'falta';
    return marcado ? 'bad' : 'normal';
  }

  protected revisar(): void {
    this.revisada.set(true);
    const todos = this.tokens().every((_, i) => {
      const esError = this.malos().includes(limpiar(this.tokens()[i]));
      return esError === this.marcas().includes(i);
    });
    if (todos) {
      this.bien.update((b) => b + 1);
      this.efectos.aplausos();
      this.efectos.confeti(40);
      this.mensaje.set('¡Excelente cazador! Encontraste todos los errores.');
    } else {
      this.efectos.error();
      const lista = this.frase()!.errores.map((e) => `${e.mal} → ${e.bien}`).join('; ');
      this.mensaje.set('Se te escapó alguno. Lo correcto es: ' + lista + '.');
    }
  }

  protected siguiente(): void {
    if (this.n() + 1 >= this.frases().length) {
      this.terminar(this.bien(), this.frases().length, `¡Cazaste ${this.bien()} de ${this.frases().length} frases!`,
        'Un buen lector también revisa cómo escribe. ¡Sigue practicando!');
      return;
    }
    this.n.update((n) => n + 1);
    this.nueva();
  }
}
