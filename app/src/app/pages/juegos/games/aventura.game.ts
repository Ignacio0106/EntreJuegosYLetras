import { Component, computed, signal } from '@angular/core';
import { AVENTURAS } from '../../../core/data/banco-literario.data';
import { Aventura } from '../../../core/models/banco.model';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

@Component({
  selector: 'app-aventura-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="Elige tu propia aventura"
      mensaje="Crea tu personaje y decide qué hace en cada momento. ¡Cada decisión cambia la historia!"
      aprendemos="Narración y decisiones: seguir una historia, imaginar consecuencias y explicar por qué elegimos un camino."
      boton="Empezar la aventura" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <label for="nom">¿Cómo se llama tu personaje?</label>
        <input id="nom" type="text" maxlength="16" placeholder="Coco" [value]="nombre()" (input)="nombre.set($any($event.target).value)" />
        <div class="selector">
          <button type="button" [attr.aria-pressed]="gen() === 'F'" (click)="gen.set('F')"><strong>Niña</strong></button>
          <button type="button" [attr.aria-pressed]="gen() === 'M'" (click)="gen.set('M')"><strong>Niño</strong></button>
        </div>
      </div>
      @if (fase() === 'jugando' && nodo(); as n) {
        <section class="tarjeta">
          <p class="progreso">Aventura: {{ historia()?.t }}</p>
          <div class="texto"><span>{{ rep(n.texto) }}</span><app-audio-btn [texto]="rep(n.texto)" /></div>
          <div class="opciones">
            @for (o of n.opciones ?? []; track o.t) {
              <button type="button" class="opcion-r" (click)="ir(o.va)"><span class="letra">›</span>{{ rep(o.t) }}</button>
            }
          </div>
          @if (camino().length) {
            <details><summary>🔖 Lo que ha pasado…</summary>@for (c of camino(); track $index) { <p>{{ rep(c) }}</p> }</details>
          }
        </section>
      }
      @if (fase() === 'final' && cierre(); as c) {
        <section class="tarjeta">
          <h3>{{ historia()?.t }}</h3>
          <p>{{ rep(c.texto) }}</p>
          @if (c.moraleja) { <p class="moraleja">💡 Lo que nos deja: {{ c.moraleja }}</p> }
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .texto { display: flex; gap: .8rem; align-items: flex-start; background: var(--sol-suave); border-radius: var(--radio-s); padding: 1.3rem 1.5rem; font-size: 1.25rem; line-height: 1.8; margin-bottom: 1.2rem; }
    details { margin-top: 1rem; } summary { cursor: pointer; font-weight: 700; }
    .moraleja { background: var(--menta-suave); border-radius: var(--radio-s); padding: .8rem 1.1rem; font-weight: 700; }
  `,
})
export class AventuraGame extends JuegoBase {
  readonly slug = 'aventura';
  protected readonly nombre = signal('Coco');
  protected readonly gen = signal<'F' | 'M'>('F');
  protected readonly historia = signal<Aventura | null>(null);
  protected readonly actualId = signal('');
  protected readonly camino = signal<string[]>([]);
  protected readonly nodo = computed(() => {
    const n = this.historia()?.nodos[this.actualId()];
    return n && !n.final ? n : null;
  });
  protected readonly cierre = computed(() => {
    const n = this.historia()?.nodos[this.actualId()];
    return n?.final ? n : null;
  });

  protected rep(s: string): string {
    const f = this.gen() === 'F';
    return s
      .replace(/\{nom\}/g, this.nombre().trim() || 'Coco')
      .replace(/\{el\}/g, f ? 'la' : 'el').replace(/\{un\}/g, f ? 'una' : 'un')
      .replace(/\{o\}/g, f ? 'a' : 'o').replace(/\{pron\}/g, f ? 'ella' : 'él');
  }

  protected iniciar(): void {
    const h = this.banco.azar(this.banco.filtrarOTodo(AVENTURAS));
    this.historia.set(h);
    this.actualId.set(h.inicio);
    this.camino.set([]);
    this.empezar();
  }

  protected ir(id: string): void {
    const n = this.nodo();
    if (n) this.camino.update((c) => [...c, n.texto]);
    this.actualId.set(id);
    this.efectos.click();
    const sig = this.historia()?.nodos[id];
    if (sig?.final) this.terminar(1, 1, '¡Fin de la aventura!', 'Vuelve a jugar y toma otros caminos para vivir otra historia.');
  }
}
