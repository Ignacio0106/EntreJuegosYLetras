import { inject, signal } from '@angular/core';
import { AvisosService } from '../../core/services/avisos.service';
import { BancoService } from '../../core/services/banco.service';
import { EfectosService } from '../../core/services/efectos.service';
import { ProgresoService } from '../../core/services/progreso.service';

export type Fase = 'intro' | 'jugando' | 'final';

/** Lo que comparten todos los juegos: fases, efectos y registro de estrellas. */
export abstract class JuegoBase {
  protected readonly banco = inject(BancoService);
  protected readonly efectos = inject(EfectosService);
  protected readonly avisos = inject(AvisosService);
  protected readonly progreso = inject(ProgresoService);

  abstract readonly slug: string;

  readonly fase = signal<Fase>('intro');
  readonly finalTitulo = signal('');
  readonly finalTexto = signal('');
  readonly estrellasGanadas = signal(0);

  protected empezar(): void {
    this.fase.set('jugando');
    this.efectos.click();
  }

  /** Cierra la partida, suma estrellas según el porcentaje de aciertos y muestra el final. */
  protected terminar(aciertos: number, total: number, titulo: string, texto: string): void {
    const pct = total ? (aciertos / total) * 100 : 100;
    this.estrellasGanadas.set(this.progreso.registrarPartida(this.slug, pct));
    this.finalTitulo.set(titulo);
    this.finalTexto.set(texto);
    this.fase.set('final');
    this.efectos.aplausos();
    this.efectos.confeti(90);
  }

  protected pausa(ms: number, fn: () => void): void {
    setTimeout(fn, ms);
  }
}
