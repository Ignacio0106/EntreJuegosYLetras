import { Component, computed, signal } from '@angular/core';
import { AUTORES, LEYENDAS, LIBROS, PERSONAJES } from '../../../core/data/banco-literario.data';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

type Tema = 'todos' | 'libros' | 'personajes' | 'autores' | 'leyendas';
interface Bola { v: string; tipo: string; dato: string; }

@Component({
  selector: 'app-bingo-game',
  imports: [GameShell],
  template: `
    <app-game-shell titulo="Bingo literario"
      mensaje="La tómbola saca temas uno por uno. Marca en tu cartón lo que salga: libros, personajes, autores y leyendas."
      aprendemos="Cultura general: cada tema que sale viene con un dato curioso."
      boton="Empezar el bingo" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <h3>¿Con qué palabras jugamos?</h3>
        <div class="selector">
          @for (t of temas; track t.id) {
            <button type="button" [attr.aria-pressed]="tema() === t.id" (click)="tema.set(t.id)"><strong>{{ t.titulo }}</strong></button>
          }
        </div>
        <h3>Cartones para imprimir</h3>
        <div class="fila">
          <label for="nc" class="sr-only">Cuántos cartones</label>
          <input id="nc" type="number" min="1" max="60" [value]="cartones()" (input)="cartones.set(+$any($event.target).value)" style="max-width:120px" />
          <button type="button" class="btn btn-sol" [disabled]="generando()" (click)="pdf()">{{ generando() ? 'Preparando…' : '⬇ Descargar cartones (PDF)' }}</button>
        </div>
        <p class="nota">Salen 4 cartones por hoja, cada vez distintos.</p>
      </div>
      @if (fase() === 'jugando') {
        <section class="tarjeta centro">
          <h2>🎱 La tómbola literaria</h2>
          <div class="bola" [class.gira]="animando()" aria-live="polite">{{ mostrada() }}</div>
          <p class="nota">{{ nota() }}</p>
          <div class="fila centro">
            <button type="button" class="btn btn-coral btn-grande" [disabled]="animando() || quedan() === 0" (click)="sacar()">Sacar tema</button>
            <button type="button" class="btn btn-claro" (click)="reiniciar()">Nueva ronda</button>
            <button type="button" class="btn btn-sol" (click)="fin()">Terminar</button>
          </div>
          @if (ultima(); as u) {
            <div class="dato"><b>{{ u.v }}</b> <span class="etiqueta-chip">{{ u.tipo }}</span><p>{{ u.dato }}</p></div>
          }
          <h3>Ya salieron</h3>
          <div class="hist">
            @for (b of sacadas(); track b.v) { <span class="chip" [class]="'chip ' + b.tipo">{{ b.v }}</span> } @empty { <span class="nota">Todavía no sale ningún tema.</span> }
          </div>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .bola { min-height: 130px; display: grid; place-items: center; margin: 1rem auto; max-width: 520px; background: var(--sol); border: 4px solid var(--tinta); border-radius: 40px; padding: 1rem 1.4rem; font: 800 clamp(1.5rem, 5vw, 2.4rem)/1.2 var(--f-titulo); box-shadow: 0 7px 0 var(--tinta); }
    .bola.gira { animation: rebota .2s infinite; }
    @keyframes rebota { 50% { transform: scale(.97) rotate(-1deg); } }
    .dato { background: var(--cielo-suave); border-radius: var(--radio-s); padding: .9rem 1.2rem; margin: 1rem auto; max-width: 560px; }
    .hist { display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; }
    .chip { border: 2px solid var(--tinta); border-radius: 999px; padding: .15em .8em; font: 700 .9rem var(--f-titulo); background: #fff; }
    .chip.Libro { background: var(--cielo-suave); } .chip.Personaje { background: var(--coral-suave); }
    .chip.Autor { background: var(--sol-suave); } .chip.Leyenda { background: var(--menta-suave); }
  `,
})
export class BingoGame extends JuegoBase {
  readonly slug = 'bingo';
  protected readonly temas: { id: Tema; titulo: string }[] = [
    { id: 'todos', titulo: 'Todo mezclado' }, { id: 'libros', titulo: 'Títulos' },
    { id: 'personajes', titulo: 'Personajes' }, { id: 'autores', titulo: 'Autores' }, { id: 'leyendas', titulo: 'Leyendas' },
  ];
  protected readonly tema = signal<Tema>('todos');
  protected readonly cartones = signal(12);
  protected readonly generando = signal(false);
  protected readonly bolsa = signal<Bola[]>([]);
  protected readonly sacadas = signal<Bola[]>([]);
  protected readonly mostrada = signal('?');
  protected readonly animando = signal(false);
  protected readonly quedan = computed(() => this.bolsa().length - this.sacadas().length);
  protected readonly ultima = computed(() => this.sacadas().at(-1) ?? null);
  protected readonly nota = computed(() => (this.quedan() > 0 ? `Faltan ${this.quedan()} temas por salir.` : '¡Salieron todos! Empieza una nueva ronda.'));

  private construir(tema: Tema): Bola[] {
    const b = this.banco;
    const l: Bola[] = [];
    if (tema === 'todos' || tema === 'libros')
      b.filtrarOTodo(LIBROS).forEach((o) => l.push({ v: o.t, tipo: 'Libro', dato: `Es de ${o.a}, del año ${o.y}. ${o.s}` }));
    if (tema === 'todos' || tema === 'personajes')
      b.filtrarOTodo(PERSONAJES).forEach((o) => l.push({ v: o.n, tipo: 'Personaje', dato: `Aparece en «${o.l}». ¿Te acuerdas de su historia?` }));
    if (tema === 'todos' || tema === 'autores')
      b.filtrarOTodo(AUTORES).forEach((o) => l.push({ v: o.n, tipo: 'Autor', dato: o.o.length ? `Obras suyas: ${o.o.join(', ')}.` : 'Es una persona de nuestras letras.' }));
    if (tema === 'todos' || tema === 'leyendas')
      b.filtrarOTodo(LEYENDAS).forEach((o) => l.push({ v: o.n, tipo: 'Leyenda', dato: 'Leyenda tradicional costarricense. ' + (o.p[0] ?? '') }));
    return b.barajar(l);
  }

  protected iniciar(): void {
    this.reiniciar();
    this.empezar();
  }

  protected reiniciar(): void {
    let l = this.construir(this.tema());
    if (l.length < 8) l = this.construir('todos');
    this.bolsa.set(l);
    this.sacadas.set([]);
    this.mostrada.set('?');
  }

  protected sacar(): void {
    if (this.animando() || this.quedan() === 0) return;
    this.animando.set(true);
    const pendientes = this.bolsa().filter((p) => !this.sacadas().includes(p));
    const pick = this.banco.azar(pendientes);
    let ticks = 0;
    const iv = setInterval(() => {
      this.mostrada.set(this.banco.azar(this.bolsa()).v);
      this.efectos.giro();
      if (++ticks < 14) return;
      clearInterval(iv);
      this.sacadas.update((s) => [...s, pick]);
      this.mostrada.set(pick.v);
      this.animando.set(false);
      this.efectos.aplausos();
      this.efectos.confeti(30);
    }, 95);
  }

  protected fin(): void {
    this.terminar(1, 1, '¡Qué buen bingo!', `Salieron ${this.sacadas().length} temas. Cada uno es una puerta a un libro nuevo.`);
  }

  /** Genera un PDF con cartones de 3×3 (centro libre), 4 por hoja. */
  protected async pdf(): Promise<void> {
    this.generando.set(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      let pool = this.construir(this.tema());
      if (pool.length < 8) pool = this.construir('todos');
      const total = Math.max(1, Math.min(60, this.cartones() || 12));
      const w = 90, h = 120;
      for (let i = 0; i < total; i++) {
        if (i > 0 && i % 4 === 0) doc.addPage();
        const x = 10 + (i % 2) * 100;
        const y = 10 + (Math.floor((i % 4) / 2)) * 140;
        const palabras = this.banco.barajar(pool).slice(0, 8).map((p) => p.v);
        palabras.splice(4, 0, '★ LIBRE ★');
        doc.setDrawColor(35, 50, 74);
        doc.setLineWidth(0.8);
        doc.roundedRect(x, y, w, h, 4, 4);
        doc.setFontSize(14);
        doc.text('Bingo literario', x + w / 2, y + 9, { align: 'center' });
        const cw = w / 3, ch = (h - 16) / 3;
        palabras.forEach((p, k) => {
          const cx = x + (k % 3) * cw, cy = y + 14 + Math.floor(k / 3) * ch;
          doc.setLineWidth(0.3);
          doc.rect(cx, cy, cw, ch);
          doc.setFontSize(10);
          doc.text(doc.splitTextToSize(p, cw - 4), cx + cw / 2, cy + ch / 2 - 2, { align: 'center' });
        });
      }
      doc.save('cartones-bingo-literario.pdf');
    } catch {
      this.avisos.toast('No se pudo crear el PDF.');
    } finally {
      this.generando.set(false);
    }
  }
}
