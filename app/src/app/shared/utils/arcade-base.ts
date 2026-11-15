import { DestroyRef, inject, signal } from '@angular/core';
import { JuegoBase } from './juego-base';

export interface Velocidad {
  id: string;
  titulo: string;
  ayuda: string;
  factor: number;
}

/** Tres ritmos para que cada niña y niño juegue a su paso. */
export const VELOCIDADES: Velocidad[] = [
  { id: 'calma', titulo: 'Tranquila 🐢', ayuda: 'Con calma, para empezar', factor: 0.65 },
  { id: 'normal', titulo: 'Normal 🐇', ayuda: 'El ritmo de siempre', factor: 1 },
  { id: 'rapida', titulo: 'Rápida 🚀', ayuda: 'Para valientes', factor: 1.35 },
];

/** Velocidad de la cesta con teclado o botones (% del ancho del campo por segundo). */
const VEL_CESTA = 85;

/**
 * Lo que comparten los juegos de acción (atrapar, reventar, pescar…):
 * un bucle con requestAnimationFrame, pausa, velocidad elegible, cesta que se mueve con
 * mouse, dedo, flechas o botones, y un destello verde/rojo al acertar o fallar.
 * Se apoya en JuegoBase, así que las fases, los sonidos y las estrellas funcionan igual.
 */
export abstract class ArcadeBase extends JuegoBase {
  readonly pausado = signal(false);
  readonly flash = signal<'' | 'ok' | 'mal'>('');
  readonly cestaX = signal(50);
  readonly velocidadId = signal('normal');
  protected readonly mensaje = signal('');

  /** Los juegos con cesta lo activan para escuchar flechas y A/D. */
  protected usaCesta = false;

  private activo = false;
  private raf = 0;
  private ultimo = 0;
  private botonDir = 0;
  private contador = 0;
  private temporizadorFlash: ReturnType<typeof setTimeout> | undefined;
  private readonly teclas = new Set<'i' | 'd'>();

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.pararBucle());
  }

  /** Se llama en cada cuadro con los segundos transcurridos (sin contar la pausa). */
  protected abstract tick(dt: number): void;

  protected get factor(): number {
    return VELOCIDADES.find((v) => v.id === this.velocidadId())?.factor ?? 1;
  }

  protected nuevoId(): number {
    return ++this.contador;
  }

  /** Prepara el control y arranca: fase "jugando" + bucle. */
  protected comenzar(): void {
    this.pausado.set(false);
    this.flash.set('');
    this.mensaje.set('');
    this.cestaX.set(50);
    this.empezar();
    this.arrancarBucle();
  }

  protected override terminar(aciertos: number, total: number, titulo: string, texto: string): void {
    this.pararBucle();
    super.terminar(aciertos, total, titulo, texto);
  }

  alternarPausa(): void {
    this.efectos.click();
    this.pausado.update((p) => !p);
  }

  ponerCesta(x: number): void {
    if (this.pausado()) return;
    this.cestaX.set(Math.min(93, Math.max(7, x)));
  }

  moverBoton(dir: number): void {
    this.botonDir = dir;
  }

  protected parpadeo(tipo: 'ok' | 'mal'): void {
    clearTimeout(this.temporizadorFlash);
    this.flash.set(tipo);
    this.temporizadorFlash = setTimeout(() => this.flash.set(''), 380);
  }

  private arrancarBucle(): void {
    if (this.activo) return;
    this.activo = true;
    this.ultimo = performance.now();
    window.addEventListener('keydown', this.alPulsar);
    window.addEventListener('keyup', this.alSoltar);
    this.raf = requestAnimationFrame(this.paso);
  }

  protected pararBucle(): void {
    this.activo = false;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.temporizadorFlash);
    window.removeEventListener('keydown', this.alPulsar);
    window.removeEventListener('keyup', this.alSoltar);
    this.teclas.clear();
    this.botonDir = 0;
  }

  private readonly paso = (ahora: number): void => {
    if (!this.activo) return;
    // Se limita el salto de tiempo: si la pestaña estuvo oculta, el juego no "se adelanta".
    const dt = Math.min(0.05, (ahora - this.ultimo) / 1000);
    this.ultimo = ahora;
    if (!this.pausado()) {
      if (this.usaCesta) this.moverCesta(dt);
      this.tick(dt);
    }
    if (this.activo) this.raf = requestAnimationFrame(this.paso);
  };

  private moverCesta(dt: number): void {
    const dir = (this.teclas.has('d') ? 1 : 0) - (this.teclas.has('i') ? 1 : 0) || this.botonDir;
    if (dir) this.cestaX.update((x) => Math.min(93, Math.max(7, x + dir * VEL_CESTA * dt)));
  }

  private tecla(e: KeyboardEvent): 'i' | 'd' | null {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') return 'i';
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') return 'd';
    return null;
  }

  private readonly alPulsar = (e: KeyboardEvent): void => {
    if (!this.usaCesta) return;
    const t = this.tecla(e);
    if (!t) return;
    if (e.key.startsWith('Arrow')) e.preventDefault(); // que la página no se desplace
    this.teclas.add(t);
  };

  private readonly alSoltar = (e: KeyboardEvent): void => {
    const t = this.tecla(e);
    if (t) this.teclas.delete(t);
  };
}
