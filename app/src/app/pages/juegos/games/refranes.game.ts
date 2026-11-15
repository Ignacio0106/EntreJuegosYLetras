import { Component, signal } from '@angular/core';
import { REFRANES } from '../../../core/data/banco-literario.data';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { Pareja, TableroMemoria } from '../../../shared/components/tablero-memoria/tablero-memoria';
import { JuegoBase } from '../../../shared/utils/juego-base';

@Component({
  selector: 'app-refranes-game',
  imports: [GameShell, TableroMemoria],
  template: `
    <app-game-shell titulo="Une el inicio con su final"
      mensaje="Una carta tiene el inicio de un refrán y otra su final. Ejemplo: «Más vale tarde que…» va con «nunca»."
      aprendemos="Sabiduría popular: los refranes guardan lo que nuestras abuelas aprendieron."
      boton="Repartir las cartas" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando') {
        <section class="tarjeta">
          <app-tablero-memoria [parejas]="parejas()" (terminado)="fin($event)" />
          <div class="fila centro"><button type="button" class="btn btn-claro" (click)="barajar()">Barajar de nuevo</button></div>
        </section>
      }
    </app-game-shell>
  `,
})
export class RefranesGame extends JuegoBase {
  readonly slug = 'refranes';
  protected readonly parejas = signal<Pareja[]>([]);

  protected iniciar(): void {
    this.barajar();
    this.empezar();
  }

  protected barajar(): void {
    const lista = this.banco.filtrarOTodo(REFRANES, 8);
    this.parejas.set(this.banco.barajar(lista).slice(0, 8).map((o) => ({ l: o.i, r: o.f })));
  }

  protected fin(intentos: number): void {
    const total = this.parejas().length;
    const pct = Math.min(100, (total / Math.max(intentos, 1)) * 140);
    this.terminar(pct, 100, '¡Todos los refranes completos!', `Los encontraste en ${intentos} intentos.`);
  }
}
