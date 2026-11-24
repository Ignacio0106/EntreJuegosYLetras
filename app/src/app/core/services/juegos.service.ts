import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CATEGORIAS, JUEGOS } from '../data/juegos.data';
import { Categoria, JuegoEstado } from '../models/juego.model';
import { AjustesNubeService } from './ajustes-nube.service';
import { AuthService } from './auth.service';

const CLAVE = 'jdl-juegos-habilitados';

/** Catálogo de juegos + estado habilitado/deshabilitado (lo cambia el admin). Sin base de datos. */
@Injectable({ providedIn: 'root' })
export class JuegosService {
  private readonly auth = inject(AuthService);
  private readonly nube = inject(AjustesNubeService);
  private readonly cambios = signal<Record<string, boolean>>(this.leer());

  readonly categorias: Categoria[] = CATEGORIAS;

  /** Todos los juegos con su estado actual. */
  readonly todos = computed<JuegoEstado[]>(() => {
    const c = this.cambios();
    return JUEGOS.map((j) => ({
      ...j,
      habilitado: c[j.slug] ?? j.habilitado,
      color: this.categorias.find((x) => x.id === j.categoria)!.color,
    }));
  });

  /** Lo que se ve en el menú: el estudiante solo ve los habilitados; el admin los ve todos. */
  readonly visibles = computed(() =>
    this.auth.esDocente() ? this.todos() : this.todos().filter((j) => j.habilitado)
  );

  readonly porCategoria = computed(() =>
    this.categorias
      .map((cat) => ({ cat, juegos: this.visibles().filter((j) => j.categoria === cat.id) }))
      .filter((g) => g.juegos.length > 0)
  );

  readonly totalHabilitados = computed(() => this.todos().filter((j) => j.habilitado).length);

  constructor() {
    effect(() => localStorage.setItem(CLAVE, JSON.stringify(this.cambios())));
    // Lo que diga Firebase manda (se actualiza en vivo en todos los dispositivos).
    effect(() => {
      const remoto = this.nube.datos();
      if (remoto) this.cambios.set(remoto.juegos ?? {});
    });
  }

  buscar(slug: string): JuegoEstado | undefined {
    return this.todos().find((j) => j.slug === slug);
  }

  disponible(slug: string): boolean {
    const j = this.buscar(slug);
    return !!j && (j.habilitado || this.auth.esDocente());
  }

  alternar(slug: string): void {
    const j = this.buscar(slug);
    if (j) this.establecer(slug, !j.habilitado);
  }

  establecer(slug: string, valor: boolean): void {
    this.cambios.update((c) => ({ ...c, [slug]: valor }));
    this.persistir();
  }

  establecerVarios(slugs: string[], valor: boolean): void {
    this.cambios.update((c) => {
      const n = { ...c };
      slugs.forEach((s) => (n[s] = valor));
      return n;
    });
    this.persistir();
  }

  restablecer(): void {
    this.cambios.set({});
    this.persistir();
  }

  /** Solo el docente puede escribir en Firebase (las reglas también lo exigen). */
  private persistir(): void {
    if (this.nube.activo && this.auth.esDocente()) void this.nube.guardar({ juegos: this.cambios() });
  }

  private leer(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(CLAVE);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  }
}
