import { Component, signal } from '@angular/core';
import { DADOS } from '../../../core/data/banco-literario.data';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

type Clave = 'personajes' | 'lugares' | 'problemas' | 'objetos';
const CAMPOS: { k: Clave; label: string; ico: string }[] = [
  { k: 'personajes', label: 'Personaje', ico: '🧑‍🎤' },
  { k: 'lugares', label: 'Lugar', ico: '🏡' },
  { k: 'problemas', label: 'Problema', ico: '❓' },
  { k: 'objetos', label: 'Objeto', ico: '🎁' },
];

@Component({
  selector: 'app-dado-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="¡Inventemos un cuento!"
      mensaje="Los dados sacan un personaje, un lugar, un problema y un objeto. Con esas cuatro piezas, inventa un cuento en voz alta."
      aprendemos="Imaginación y expresión oral. No hay ideas malas: toda idea sirve para contar."
      boton="Tirar los dados" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando') {
        <section class="tarjeta">
          <div class="dados">
            @for (c of campos; track c.k) {
              <div class="dado" [class.gira]="girando()">
                <span class="ico" aria-hidden="true">{{ c.ico }}</span>
                <strong>{{ c.label }}</strong>
                <span class="txt">{{ actual()[c.k] || '?' }}</span>
                <button type="button" class="btn btn-claro btn-mini" [disabled]="girando()" (click)="cambiar(c.k)">Cambiar</button>
              </div>
            }
          </div>
          <div class="fila centro">
            <button type="button" class="btn btn-coral btn-grande" [disabled]="girando()" (click)="tirar()">🎲 Tirar de nuevo</button>
            <button type="button" class="btn btn-menta" [disabled]="girando()" (click)="guardar()">Guardar idea</button>
            <app-audio-btn [texto]="lectura()" etiqueta="Escuchar las cuatro piezas" />
          </div>
          <p class="mensaje centro" role="status">{{ mensaje() }}</p>
          <h3>Ideas guardadas</h3>
          @for (i of ideas(); track $index) { <p class="idea"><b>{{ $index + 1 }}.</b> {{ i }}</p> } @empty { <p class="nota">Todavía no has guardado ideas.</p> }
          <button type="button" class="btn btn-sol" (click)="fin()">Terminar</button>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .dados { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; margin-bottom: 1.2rem; }
    .dado { background: var(--sol-suave); border: 3px solid var(--tinta); border-radius: 22px; padding: 1rem; text-align: center; display: grid; gap: .4rem; justify-items: center; }
    .dado .ico { font-size: 2.4rem; } .dado .txt { font: 700 1.1rem var(--f-titulo); min-height: 3.2em; display: grid; place-items: center; }
    .dado.gira { animation: salta .3s infinite; }
    @keyframes salta { 50% { transform: translateY(-6px) rotate(-2deg); } }
    .idea { background: var(--menta-suave); border-radius: 14px; padding: .5rem .9rem; max-width: none; }
  `,
})
export class DadoGame extends JuegoBase {
  readonly slug = 'dado';
  protected readonly campos = CAMPOS;
  protected readonly actual = signal<Record<Clave, string>>({ personajes: '', lugares: '', problemas: '', objetos: '' });
  protected readonly girando = signal(false);
  protected readonly ideas = signal<string[]>([]);
  protected readonly mensaje = signal('');

  protected iniciar(): void {
    this.ideas.set([]);
    this.actual.set({ personajes: '', lugares: '', problemas: '', objetos: '' });
    this.empezar();
    this.tirar();
  }

  private fuente(k: Clave): string[] {
    return this.banco.filtrarOTodo(DADOS[k]).map((x) => x.x);
  }

  private azar(k: Clave): string {
    const previo = this.actual()[k];
    const op = this.fuente(k).filter((x) => x !== previo);
    return this.banco.azar(op.length ? op : this.fuente(k));
  }

  protected lectura(): string {
    const a = this.actual();
    return `Personaje: ${a.personajes}. Lugar: ${a.lugares}. Problema: ${a.problemas}. Objeto: ${a.objetos}.`;
  }

  protected tirar(): void {
    if (this.girando()) return;
    this.girando.set(true);
    this.mensaje.set('');
    let ticks = 0;
    const iv = setInterval(() => {
      this.actual.set({
        personajes: this.banco.azar(this.fuente('personajes')), lugares: this.banco.azar(this.fuente('lugares')),
        problemas: this.banco.azar(this.fuente('problemas')), objetos: this.banco.azar(this.fuente('objetos')),
      });
      this.efectos.giro();
      if (++ticks < 10) return;
      clearInterval(iv);
      this.girando.set(false);
      this.efectos.aplausos();
      this.mensaje.set('¡Tienes tu cuento! Cuéntalo en voz alta: «Había una vez…»');
    }, 90);
  }

  protected cambiar(k: Clave): void {
    this.actual.update((a) => ({ ...a, [k]: this.azar(k) }));
    this.efectos.click();
  }

  protected guardar(): void {
    const a = this.actual();
    this.ideas.update((i) => [...i, `${a.personajes} · ${a.lugares} · ${a.problemas} · ${a.objetos}`]);
    this.efectos.correcto();
    this.avisos.toast('¡Idea guardada!');
  }

  protected fin(): void {
    const n = this.ideas().length;
    this.terminar(1, 1, `¡Inventaste ${n} cuento(s)!`,
      n ? 'Escribe esas ideas en un cuaderno. ¡Pueden convertirse en un libro!' : 'Tira los dados otra vez y deja volar la imaginación.');
  }
}
