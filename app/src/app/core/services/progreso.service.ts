import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { INSIGNIAS, LIBROS_MEDIDOR, META_ESTRELLAS } from '../data/insignias.data';
import { JUEGOS } from '../data/juegos.data';
import { EstadoProgreso, Insignia, PerfilNino } from '../models/progreso.model';
import { AvisosService } from './avisos.service';
import { EfectosService } from './efectos.service';

const CLAVE = 'jdl-progreso';

export const AVATARES = ['🦥', '🐢', '🦜', '🐸', '🦋', '🐯', '🐙', '🦊'];

const INICIAL: EstadoProgreso = {
  perfil: { nombre: 'Lector', avatar: '🦥' },
  juegos: {},
  insignias: [],
};

/** Perfil, estrellas, insignias y medidor de lectura. Todo se guarda en el navegador. */
@Injectable({ providedIn: 'root' })
export class ProgresoService {
  private readonly avisos = inject(AvisosService);
  private readonly efectos = inject(EfectosService);
  private readonly estado = signal<EstadoProgreso>(this.leer());

  readonly perfil = computed(() => this.estado().perfil);
  readonly juegos = computed(() => this.estado().juegos);
  readonly meta = META_ESTRELLAS;

  readonly estrellas = computed(() =>
    Object.values(this.estado().juegos).reduce((n, j) => n + j.estrellas, 0)
  );
  readonly juegosJugados = computed(
    () => Object.values(this.estado().juegos).filter((j) => j.partidas > 0).length
  );
  /** Libros llenos del medidor (0 a 10). */
  readonly librosLlenos = computed(() =>
    Math.min(LIBROS_MEDIDOR, Math.floor((this.estrellas() / META_ESTRELLAS) * LIBROS_MEDIDOR))
  );
  readonly libros = Array.from({ length: LIBROS_MEDIDOR }, (_, i) => i);

  readonly insignias = computed(() => {
    const ganadas = this.estado().insignias;
    return INSIGNIAS.map((i) => ({ ...i, ganada: ganadas.includes(i.id) }));
  });

  constructor() {
    effect(() => localStorage.setItem(CLAVE, JSON.stringify(this.estado())));
  }

  estrellasDe(slug: string): number {
    return this.estado().juegos[slug]?.estrellas ?? 0;
  }

  partidasDe(slug: string): number {
    return this.estado().juegos[slug]?.partidas ?? 0;
  }

  /** Se llama al terminar un juego. pct va de 0 a 100. Devuelve las estrellas ganadas (1 a 3). */
  registrarPartida(slug: string, pct: number): number {
    const ganadas = pct >= 85 ? 3 : pct >= 60 ? 2 : 1;
    this.estado.update((e) => {
      const previo = e.juegos[slug] ?? { estrellas: 0, partidas: 0, mejor: 0 };
      return {
        ...e,
        juegos: {
          ...e.juegos,
          [slug]: {
            estrellas: Math.max(previo.estrellas, ganadas),
            partidas: previo.partidas + 1,
            mejor: Math.max(previo.mejor, Math.round(pct)),
          },
        },
      };
    });
    this.revisarInsignias();
    return ganadas;
  }

  guardarPerfil(perfil: PerfilNino): void {
    this.estado.update((e) => ({
      ...e,
      perfil: { nombre: perfil.nombre.trim().slice(0, 14) || 'Lector', avatar: perfil.avatar },
    }));
  }

  reiniciar(): void {
    this.estado.set({ ...INICIAL, perfil: this.estado().perfil });
  }

  private revisarInsignias(): void {
    const e = this.estado();
    const jugados = Object.entries(e.juegos).filter(([, j]) => j.partidas > 0);
    const categorias = new Set(
      jugados.map(([slug]) => JUEGOS.find((j) => j.slug === slug)?.categoria).filter(Boolean)
    );
    const ctx = {
      estrellas: this.estrellas(),
      juegosJugados: jugados.length,
      categoriasJugadas: categorias.size,
      juegosConTresEstrellas: jugados.filter(([, j]) => j.estrellas === 3).length,
    };
    const nuevas: Insignia[] = INSIGNIAS.filter((i) => !e.insignias.includes(i.id) && i.cumple(ctx));
    if (!nuevas.length) return;
    this.estado.update((s) => ({ ...s, insignias: [...s.insignias, ...nuevas.map((n) => n.id)] }));
    const n = nuevas[0];
    // pequeña pausa para no tapar el mensaje de fin de juego
    setTimeout(() => {
      this.efectos.aplausos();
      this.efectos.confeti(80);
      this.avisos.mostrarAviso(`¡Nueva insignia! ${n.icono}`, `${n.nombre}: ${n.descripcion}`, '¡Qué bien!');
    }, 900);
  }

  private leer(): EstadoProgreso {
    try {
      const raw = localStorage.getItem(CLAVE);
      return raw ? { ...INICIAL, ...(JSON.parse(raw) as Partial<EstadoProgreso>) } : INICIAL;
    } catch {
      return INICIAL;
    }
  }
}
