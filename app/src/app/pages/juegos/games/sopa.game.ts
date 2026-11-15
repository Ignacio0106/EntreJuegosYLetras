import { Component, computed, signal } from '@angular/core';
import { AUTORES, LEYENDAS, LIBROS, PERSONAJES } from '../../../core/data/banco-literario.data';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

type Tema = 'todos' | 'autores' | 'personajes' | 'libros' | 'leyendas';
interface Colocada { p: string; celdas: [number, number][]; ok: boolean; }
const N = 12;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Component({
  selector: 'app-sopa-game',
  imports: [GameShell],
  template: `
    <app-game-shell titulo="Sopa de letras"
      mensaje="Toca la primera y la última letra de una palabra escondida. Pueden estar en cualquier dirección."
      aprendemos="Atención y vocabulario: los nombres de nuestras letras se esconden entre las letras."
      boton="Servir la sopa" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <h3>¿Qué palabras buscamos?</h3>
        <div class="selector">
          @for (t of temas; track t.id) {
            <button type="button" [attr.aria-pressed]="tema() === t.id" (click)="tema.set(t.id)"><strong>{{ t.titulo }}</strong></button>
          }
        </div>
      </div>
      @if (fase() === 'jugando') {
        <section class="tarjeta">
          <div class="sopa">
            <div class="grid" [style.grid-template-columns]="'repeat(' + n + ', 1fr)'">
              @for (c of celdas(); track c.key) {
                <button type="button" class="celda" [class.ok]="oks().has(c.key)" [class.sel]="inicio()?.[0] === c.r && inicio()?.[1] === c.c"
                  [attr.aria-label]="'Letra ' + c.l" (click)="tocar(c.r, c.c)">{{ c.l }}</button>
              }
            </div>
            <div class="lado">
              <h3>Palabras</h3>
              <div class="chips">
                @for (p of colocadas(); track p.p) { <span class="chip" [class.ok]="p.ok">{{ p.p }}</span> }
              </div>
              <p class="nota">{{ encontradas() }} de {{ colocadas().length }} encontradas.</p>
              <button type="button" class="btn btn-claro btn-mini" (click)="nueva()">Otra sopa</button>
            </div>
          </div>
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .sopa { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.2rem; }
    @media (min-width: 900px) { .sopa { grid-template-columns: minmax(0, 520px) 1fr; } }
    .grid { display: grid; gap: 3px; max-width: 520px; }
    .celda { aspect-ratio: 1; min-width: 0; padding: 0; border: 2px solid var(--linea); border-radius: 8px; background: #fff; font: 800 clamp(.85rem, 3.2vw, 1.25rem) var(--f-titulo); color: var(--tinta); cursor: pointer; }
    .celda:hover { background: var(--cielo-suave); }
    .celda.sel { background: var(--sol); border-color: var(--tinta); }
    .celda.ok { background: var(--menta); border-color: var(--menta-fuerte); }
    .chips { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; }
    .chip { border: 2px solid var(--tinta); border-radius: 999px; padding: .15em .8em; font: 700 .95rem var(--f-titulo); background: #fff; }
    .chip.ok { background: var(--menta); text-decoration: line-through; }
  `,
})
export class SopaGame extends JuegoBase {
  readonly slug = 'sopa';
  protected readonly n = N;
  protected readonly temas: { id: Tema; titulo: string }[] = [
    { id: 'todos', titulo: 'Todo mezclado' }, { id: 'autores', titulo: 'Autores' },
    { id: 'personajes', titulo: 'Personajes' }, { id: 'libros', titulo: 'Libros' }, { id: 'leyendas', titulo: 'Leyendas' },
  ];
  protected readonly tema = signal<Tema>('todos');
  protected readonly grid = signal<string[][]>([]);
  protected readonly colocadas = signal<Colocada[]>([]);
  protected readonly inicio = signal<[number, number] | null>(null);
  protected readonly encontradas = computed(() => this.colocadas().filter((p) => p.ok).length);
  protected readonly celdas = computed(() =>
    this.grid().flatMap((fila, r) => fila.map((l, c) => ({ r, c, l, key: `${r}-${c}` })))
  );
  protected readonly oks = computed(() => {
    const s = new Set<string>();
    this.colocadas().filter((p) => p.ok).forEach((p) => p.celdas.forEach(([r, c]) => s.add(`${r}-${c}`)));
    return s;
  });

  protected iniciar(): void {
    this.nueva();
    this.empezar();
  }

  private palabras(tema: Tema): string[] {
    const b = this.banco;
    const fuentes: string[] = [];
    if (tema === 'todos' || tema === 'autores') b.filtrarOTodo(AUTORES).forEach((o) => fuentes.push(o.n));
    if (tema === 'todos' || tema === 'personajes') b.filtrarOTodo(PERSONAJES).forEach((o) => fuentes.push(o.n));
    if (tema === 'todos' || tema === 'libros') b.filtrarOTodo(LIBROS).forEach((o) => fuentes.push(o.t));
    if (tema === 'todos' || tema === 'leyendas') b.filtrarOTodo(LEYENDAS).forEach((o) => fuentes.push(o.n));
    const vistas = new Set<string>();
    fuentes.forEach((f) =>
      b.normalizar(f).replace(/[^A-Z]+/g, ' ').split(' ').forEach((t) => {
        if (t.length >= 4 && t.length <= N) vistas.add(t);
      })
    );
    return [...vistas];
  }

  protected nueva(): void {
    const grid: string[][] = Array.from({ length: N }, () => Array<string>(N).fill(''));
    let lista = this.banco.barajar(this.palabras(this.tema())).slice(0, 8);
    if (lista.length < 8) lista = this.banco.barajar(this.palabras('todos')).slice(0, 8);
    const dirs = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
    const colocadas: Colocada[] = [];
    for (const p of lista) {
      for (let intento = 0; intento < 300; intento++) {
        const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
        const f = Math.floor(Math.random() * N);
        const c = Math.floor(Math.random() * N);
        const fr = f + dr * (p.length - 1);
        const fc = c + dc * (p.length - 1);
        if (fr < 0 || fr >= N || fc < 0 || fc >= N) continue;
        const celdas: [number, number][] = [];
        let ok = true;
        for (let k = 0; k < p.length; k++) {
          const r = f + dr * k;
          const cc = c + dc * k;
          if (grid[r][cc] && grid[r][cc] !== p[k]) { ok = false; break; }
          celdas.push([r, cc]);
        }
        if (!ok) continue;
        celdas.forEach(([r, cc], k) => (grid[r][cc] = p[k]));
        colocadas.push({ p, celdas, ok: false });
        break;
      }
    }
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!grid[r][c]) grid[r][c] = ABC[Math.floor(Math.random() * ABC.length)];
    this.grid.set(grid);
    this.colocadas.set(colocadas);
    this.inicio.set(null);
    this.efectos.click();
  }

  protected tocar(r: number, c: number): void {
    const a = this.inicio();
    if (!a) { this.inicio.set([r, c]); this.efectos.click(); return; }
    this.inicio.set(null);
    const dr = r - a[0];
    const dc = c - a[1];
    if (dr === 0 && dc === 0) return;
    if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) {
      this.avisos.toast('Tiene que ser en línea recta.');
      return;
    }
    const sr = Math.sign(dr);
    const sc = Math.sign(dc);
    const largo = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    let s = '';
    for (let k = 0; k < largo; k++) s += this.grid()[a[0] + sr * k][a[1] + sc * k];
    const rev = [...s].reverse().join('');
    const hallada = this.colocadas().find((p) => !p.ok && (p.p === s || p.p === rev));
    if (!hallada) {
      this.efectos.error();
      this.avisos.toast('Esa no está en la lista.');
      return;
    }
    this.colocadas.update((l) => l.map((p) => (p === hallada ? { ...p, ok: true } : p)));
    this.efectos.correcto();
    if (this.encontradas() === this.colocadas().length) {
      setTimeout(() => this.terminar(this.encontradas(), this.colocadas().length, '¡Sopa completa!',
        `Encontraste las ${this.colocadas().length} palabras. ¿De qué libro o leyenda es cada una?`), 600);
    }
  }
}
