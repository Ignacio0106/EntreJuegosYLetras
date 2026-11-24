import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { INSIGNIAS, LIBROS_MEDIDOR, META_ESTRELLAS } from '../data/insignias.data';
import { JUEGOS } from '../data/juegos.data';
import { EstadoProgreso, Insignia, PerfilNino } from '../models/progreso.model';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { AvisosService } from './avisos.service';
import { EfectosService } from './efectos.service';
import { FirebaseService } from './firebase.service';

const CLAVE = 'jdl-progreso';
const CLAVE_CODIGO = 'jdl-codigo-lector';
const CLAVE_LLAVE = 'jdl-llave-lector';

/** Palabras cortas y fáciles de leer para armar el código (LEON-4821). */
const PALABRAS = [
  'LEON', 'TUCAN', 'RANA', 'MONO', 'LAPA', 'GATO', 'PATO', 'LORO', 'OSO', 'PUMA', 'CEIBA', 'LUNA',
  'NUBE', 'ISLA', 'LIBRO', 'CUENTO', 'RIMA', 'ESTRELLA', 'COLIBRI', 'DELFIN', 'TORTUGA', 'JAGUAR',
  'VOLCAN', 'SELVA', 'RIO', 'MAR', 'SOL', 'FLOR', 'ARBOL', 'MARIPOSA',
];

export const AVATARES = ['🦥', '🐢', '🦜', '🐸', '🦋', '🐯', '🐙', '🦊'];

const INICIAL: EstadoProgreso = {
  perfil: { nombre: 'Lector', avatar: '🦥' },
  juegos: {},
  insignias: [],
};

/**
 * Perfil, estrellas, insignias y medidor de lectura. Se guarda en el navegador y, si Firebase está
 * configurado, también en Firestore (`lectores/{código}`). El código lo tiene cada niño y le sirve para
 * recuperar su avance en cualquier dispositivo.
 */
@Injectable({ providedIn: 'root' })
export class ProgresoService {
  private readonly avisos = inject(AvisosService);
  private readonly efectos = inject(EfectosService);
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly estado = signal<EstadoProgreso>(this.leer());
  /** Código que eligió el niño (ej. SOFI2015). Vive en este navegador; en la nube es el nombre del documento. */
  readonly codigo = signal<string | null>(this.leerCodigo());
  /** true cuando ya se leyó lo guardado en la nube (hasta entonces no se escribe, para no pisarlo). */
  private readonly sincronizado = signal(false);
  /** Llave secreta del código: solo quien creó o recuperó el código puede modificarlo (la exigen las reglas). */
  private clave: string | null = this.leerClave();
  private avisadoCodigo = false;

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

    effect(() => {
      const c = this.codigo();
      if (c) localStorage.setItem(CLAVE_CODIGO, c);
      else localStorage.removeItem(CLAVE_CODIGO);
    });

    if (!this.fb.db) return;
    // Con un código ya asignado: al abrir la app se trae lo guardado y se fusiona con lo local.
    void this.auth.listo.then(() => this.sincronizarInicial());
    // Cada cambio se guarda en la nube (con una pequeña espera para agrupar cambios).
    effect((onCleanup) => {
      const e = this.estado();
      const c = this.codigo();
      if (!c || !this.sincronizado()) return;
      const t = setTimeout(() => void this.guardarEnNube(c, e), 1000);
      onCleanup(() => clearTimeout(t));
    });
  }

  /** ¿Se guarda en la nube? (false si Firebase no está configurado) */
  readonly usaNube = this.fb.activo;

  /**
   * ¿Puede jugar? Con Firebase hace falta haber iniciado (código de lector o cuenta de docente), porque
   * si no el avance no se guardaría. Sin Firebase no hay forma de iniciar, así que se juega libremente.
   */
  readonly puedeJugar = computed(() => !this.fb.activo || !!this.codigo() || this.auth.esDocente());

  /**
   * Normaliza lo que escribe el niño: mayúsculas, sin tildes ni espacios ("sofi 2015" → "SOFI2015").
   * Devuelve '' si no sirve (debe tener de 4 a 14 letras, números o guiones).
   */
  static normalizarCodigo(texto: string): string {
    const limpio = texto
      .normalize('NFD').replace(/\p{M}/gu, '')
      .toUpperCase().replace(/[^A-Z0-9-]/g, '');
    return /^[A-Z0-9-]{4,14}$/.test(limpio) ? limpio : '';
  }

  /** Una idea de código por si al niño no se le ocurre: palabra + 4 números (LEON-4821). */
  static sugerirCodigo(): string {
    return `${PALABRAS[Math.floor(Math.random() * PALABRAS.length)]}-${1000 + Math.floor(Math.random() * 9000)}`;
  }

  /**
   * El niño elige su código. Debe ser único: si ya existe, devuelve 'repetido'.
   * La unicidad la garantiza Firestore: otra persona no puede escribir sobre un código que no es suyo.
   */
  async crearCodigo(texto: string): Promise<'ok' | 'invalido' | 'repetido' | 'error'> {
    const c = ProgresoService.normalizarCodigo(texto);
    if (!c) return 'invalido';
    if (!this.fb.db) return 'error';
    try {
      await this.auth.listo;
      const ref = doc(this.fb.db, 'lectores', c);
      if ((await getDoc(ref)).exists()) return 'repetido';
      const clave = crypto.randomUUID();
      try {
        await setDoc(ref, { ...this.estado(), clave, actualizado: Date.now() });
      } catch (err) {
        // Si alguien lo creó justo antes, las reglas rechazan esta escritura.
        if ((err as { code?: string }).code === 'permission-denied') return 'repetido';
        throw err;
      }
      this.clave = clave;
      this.guardarClave(clave);
      this.codigo.set(c);
      this.sincronizado.set(true);
      return 'ok';
    } catch (err) {
      console.warn('No se pudo crear el código de lector:', err);
      return 'error';
    }
  }

  /** Recupera el avance de otro dispositivo con un código. Devuelve false si el código no existe. */
  async usarCodigo(texto: string): Promise<boolean> {
    const c = ProgresoService.normalizarCodigo(texto);
    if (!c || !this.fb.db) return false;
    try {
      await this.auth.listo;
      const snap = await getDoc(doc(this.fb.db, 'lectores', c));
      if (!snap.exists()) return false;
      const r = snap.data() as EstadoProgreso & { clave?: string };
      this.estado.set({ perfil: r.perfil ?? INICIAL.perfil, juegos: r.juegos ?? {}, insignias: r.insignias ?? [] });
      // Un código antiguo sin llave recibe una nueva en el siguiente guardado.
      this.clave = r.clave ?? crypto.randomUUID();
      this.guardarClave(this.clave);
      this.codigo.set(c);
      this.sincronizado.set(true);
      return true;
    } catch (err) {
      console.warn('No se pudo usar el código:', err);
      return false;
    }
  }

  /** Para computadoras compartidas: deja el aparato listo para otro niño (el avance anterior sigue en la nube). */
  empezarComoOtro(): void {
    this.codigo.set(null);
    this.clave = null;
    this.guardarClave(null);
    this.sincronizado.set(false);
    this.estado.set(INICIAL);
  }

  /** Recuerda una sola vez por visita que, para no perder el avance, conviene crear un código. */
  private recordarCodigo(): void {
    if (!this.fb.activo || this.codigo() || this.avisadoCodigo) return;
    this.avisadoCodigo = true;
    setTimeout(() => this.avisos.toast('💾 Crea tu código en tu perfil para guardar tu avance.'), 2500);
  }

  private async sincronizarInicial(): Promise<void> {
    const c = this.codigo();
    if (!c || !this.fb.db) return;
    try {
      const snap = await getDoc(doc(this.fb.db, 'lectores', c));
      if (snap.exists()) {
        const r = snap.data() as EstadoProgreso & { clave?: string };
        this.estado.set(this.fusionar(this.estado(), r));
        if (!this.clave) {
          this.clave = r.clave ?? crypto.randomUUID();
          this.guardarClave(this.clave);
        }
      }
      this.sincronizado.set(true);
    } catch (err) {
      console.warn('No se pudo leer el progreso de Firebase:', err);
    }
  }

  private async guardarEnNube(codigo: string, e: EstadoProgreso): Promise<void> {
    if (!this.clave) return;
    try {
      await setDoc(doc(this.fb.db!, 'lectores', codigo), { ...e, clave: this.clave, actualizado: Date.now() });
    } catch (err) {
      console.warn('No se pudo guardar el progreso en Firebase:', err);
    }
  }

  private leerClave(): string | null {
    try {
      return localStorage.getItem(CLAVE_LLAVE);
    } catch {
      return null;
    }
  }

  private guardarClave(valor: string | null): void {
    try {
      if (valor) localStorage.setItem(CLAVE_LLAVE, valor);
      else localStorage.removeItem(CLAVE_LLAVE);
    } catch { /* sin almacenamiento: no pasa nada */ }
  }

  /** Une dos avances sin perder nada: lo mejor de cada juego y todas las insignias. */
  private fusionar(local: EstadoProgreso, remoto: EstadoProgreso): EstadoProgreso {
    const juegos = { ...local.juegos };
    for (const [slug, r] of Object.entries(remoto.juegos ?? {})) {
      const l = juegos[slug];
      juegos[slug] = l
        ? { estrellas: Math.max(l.estrellas, r.estrellas), partidas: Math.max(l.partidas, r.partidas), mejor: Math.max(l.mejor, r.mejor) }
        : r;
    }
    return {
      perfil: remoto.perfil ?? local.perfil,
      juegos,
      insignias: [...new Set([...local.insignias, ...(remoto.insignias ?? [])])],
    };
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
    // Con Firebase, las partidas de prueba del docente no se guardan: podrían sumarse al avance
    // de un niño que dejó su código activo en este navegador.
    if (this.fb.activo && this.auth.esDocente()) return ganadas;
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
    this.recordarCodigo();
    return ganadas;
  }

  guardarPerfil(perfil: PerfilNino): void {
    this.estado.update((e) => ({
      ...e,
      perfil: { nombre: perfil.nombre.trim().slice(0, 14) || 'Lector', avatar: perfil.avatar },
    }));
  }

  reiniciar(): void {
    // Un docente que limpia el equipo solo lo desvincula del código; el avance del niño sigue en la nube.
    if (this.fb.activo && this.auth.esDocente()) {
      this.empezarComoOtro();
      return;
    }
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

  private leerCodigo(): string | null {
    try {
      return localStorage.getItem(CLAVE_CODIGO);
    } catch {
      return null;
    }
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
