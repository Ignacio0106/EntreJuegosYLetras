import { Component, signal } from '@angular/core';
import { ADIVINANZAS, AUTORES, LEYENDAS, PERSONAJES } from '../../../core/data/banco-literario.data';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { Pareja, TableroMemoria } from '../../../shared/components/tablero-memoria/tablero-memoria';
import { JuegoBase } from '../../../shared/utils/juego-base';

type Tipo = 'PL' | 'AO' | 'LA' | 'AD';

@Component({
  selector: 'app-memoria-game',
  imports: [GameShell, TableroMemoria],
  template: `
    <app-game-shell titulo="Parejas y memoria"
      mensaje="Voltea dos cartas por turno. Si forman pareja, se quedan abiertas. ¡Encuéntralas todas!"
      aprendemos="Memoria y asociación: unir cada personaje, autor o leyenda con su dato."
      boton="Repartir las cartas" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      <div intro>
        <h3>¿Qué parejas buscamos?</h3>
        <div class="selector">
          @for (t of tipos; track t.id) {
            <button type="button" [attr.aria-pressed]="tipo() === t.id" (click)="tipo.set(t.id)">
              <strong>{{ t.titulo }}</strong><small>{{ t.ayuda }}</small>
            </button>
          }
        </div>
      </div>
      @if (fase() === 'jugando') {
        <section class="tarjeta">
          <app-tablero-memoria [parejas]="parejas()" (terminado)="fin($event)" />
          <div class="fila centro"><button type="button" class="btn btn-claro" (click)="barajar()">Barajar de nuevo</button></div>
        </section>
      }
    </app-game-shell>
  `,
})
export class MemoriaGame extends JuegoBase {
  readonly slug = 'memoria';
  protected readonly tipos: { id: Tipo; titulo: string; ayuda: string }[] = [
    { id: 'PL', titulo: 'Personaje y libro', ayuda: 'Cada personaje con su cuento' },
    { id: 'AO', titulo: 'Autor y obra', ayuda: 'Cada autor con su libro' },
    { id: 'LA', titulo: 'Leyenda y pista', ayuda: 'Cada leyenda con su descripción' },
    { id: 'AD', titulo: 'Adivinanza y respuesta', ayuda: 'Cada adivinanza con su solución' },
  ];
  protected readonly tipo = signal<Tipo>('PL');
  protected readonly parejas = signal<Pareja[]>([]);

  protected iniciar(): void {
    this.barajar();
    this.empezar();
  }

  protected barajar(): void {
    const b = this.banco;
    let lista: Pareja[];
    switch (this.tipo()) {
      case 'PL': lista = b.filtrarOTodo(PERSONAJES).map((o) => ({ l: o.n, r: o.l })); break;
      case 'AO': lista = b.filtrarOTodo(AUTORES).map((o) => ({ l: o.n, r: o.o[0] })); break;
      case 'LA': lista = b.filtrarOTodo(LEYENDAS).map((o) => ({ l: o.n, r: o.p[0] })); break;
      default: lista = b.filtrarOTodo(ADIVINANZAS).map((o) => ({ l: o.q, r: o.a }));
    }
    // se evitan parejas con el mismo texto a la derecha (se confundirían)
    const vistos = new Set<string>();
    lista = lista.filter((p) => (vistos.has(p.r) ? false : !!vistos.add(p.r)));
    this.parejas.set(b.barajar(lista).slice(0, 8));
  }

  protected fin(intentos: number): void {
    const total = this.parejas().length;
    const pct = Math.min(100, (total / Math.max(intentos, 1)) * 140);
    this.terminar(pct, 100, '¡Memoria completa!', `Encontraste las ${total} parejas en ${intentos} intentos.`);
  }
}
