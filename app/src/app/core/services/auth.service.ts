import { computed, inject, Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInAnonymously,
  signInWithEmailAndPassword, signOut, User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ADMINS } from '../data/usuarios.data';
import { Role } from '../models/role.model';
import { SesionUsuario } from '../models/usuario.model';
import { FirebaseService } from './firebase.service';

const CLAVE_SESION = 'jdl-sesion';

export type ResultadoLogin = 'ok' | 'incorrecto' | 'pendiente' | 'noDocente';
export type ResultadoRegistro =
  | 'ok' | 'yaPendiente' | 'yaEsDocente' | 'correoEnUso' | 'claveDebil' | 'correoInvalido' | 'error';

/**
 * Autenticación.
 * - Con Firebase configurado: los docentes inician sesión con correo y clave (Firebase Auth). Se reconocen
 *   porque existe `docentes/{uid}` en Firestore, cuyo campo `rol` es 'admin' o 'docente' (sin `rol` = admin,
 *   para el primer administrador que se crea a mano). Quien se registra queda en `solicitudes/{uid}` hasta
 *   que un administrador la apruebe. Los estudiantes entran con sesión anónima, solo para guardar su progreso.
 * - Sin Firebase: credenciales "quemadas" en core/data/usuarios.data.ts (modo de respaldo).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly fb = inject(FirebaseService);
  private readonly _usuario = signal<SesionUsuario | null>(this.fb.activo ? null : this.leerSesion());
  private readonly _uid = signal<string | null>(null);
  private readonly _uidEstudiante = signal<string | null>(null);
  private resolverListo!: () => void;
  /** Mientras se inicia sesión o se registra a alguien, el observador no debe cerrar la sesión por su cuenta. */
  private ocupado = false;

  /** Se resuelve cuando Firebase ya dijo quién es el usuario (inmediato sin Firebase). */
  readonly listo = new Promise<void>((r) => (this.resolverListo = r));
  readonly usaNube = this.fb.activo;
  readonly usuario = this._usuario.asReadonly();
  /** uid del docente con sesión iniciada (null si no hay). */
  readonly uid = this._uid.asReadonly();
  /** uid de la sesión anónima del estudiante (null sin Firebase o si entró un docente). */
  readonly uidEstudiante = this._uidEstudiante.asReadonly();
  readonly rol = computed(() => this._usuario()?.rol ?? Role.ESTUDIANTE);
  /** Docente o administrador: puede entrar al panel, manejar juegos y ver lectores. */
  readonly esDocente = computed(() => this.rol() === Role.ADMIN || this.rol() === Role.DOCENTE);
  /** Además administra a los docentes (aprobar, quitar, dar permisos) y borra lectores. */
  readonly esAdmin = computed(() => this.rol() === Role.ADMIN);

  constructor() {
    if (!this.fb.auth) {
      this.resolverListo();
      return;
    }
    const auth = this.fb.auth;
    // Seguridad: si algo tarda demasiado, la app sigue como estudiante.
    setTimeout(() => this.resolverListo(), 4000);
    onAuthStateChanged(auth, async (user) => {
      if (this.ocupado) return;
      if (!user) {
        this._usuario.set(null);
        this._uid.set(null);
        this._uidEstudiante.set(null);
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.warn('Activa "Anónimo" en Firebase Authentication para guardar el progreso:', err);
          this.resolverListo();
        }
        return;
      }
      if (user.isAnonymous) {
        this._usuario.set(null);
        this._uid.set(null);
        this._uidEstudiante.set(user.uid);
        this.resolverListo();
        return;
      }
      if (!(await this.aplicarDocente(user))) await signOut(auth);
      this.resolverListo();
    });
  }

  async login(usuario: string, clave: string): Promise<ResultadoLogin> {
    if (!this.fb.auth) return this.loginLocal(usuario, clave) ? 'ok' : 'incorrecto';
    this.ocupado = true;
    try {
      const cred = await signInWithEmailAndPassword(this.fb.auth, usuario.trim(), clave);
      if (await this.aplicarDocente(cred.user)) return 'ok';
      // No es docente todavía: ¿tiene una solicitud esperando?
      let pendiente = false;
      try {
        pendiente = (await getDoc(doc(this.fb.db!, 'solicitudes', cred.user.uid))).exists();
      } catch { /* si no se puede leer, se avisa como no docente */ }
      await signOut(this.fb.auth);
      return pendiente ? 'pendiente' : 'noDocente';
    } catch {
      return 'incorrecto';
    } finally {
      this.ocupado = false;
      await this.asegurarSesionAnonima();
    }
  }

  /** Crea la cuenta y deja una solicitud para que un administrador la apruebe. No inicia sesión. */
  async registrarDocente(nombre: string, correo: string, clave: string): Promise<ResultadoRegistro> {
    if (!this.fb.auth || !this.fb.db) return 'error';
    this.ocupado = true;
    try {
      let usuario: User;
      try {
        usuario = (await createUserWithEmailAndPassword(this.fb.auth, correo.trim(), clave)).user;
      } catch (err) {
        if ((err as { code?: string }).code !== 'auth/email-already-in-use') throw err;
        // La cuenta ya existe (por ejemplo, un docente al que se quitó el acceso y vuelve a pedirlo):
        // se reutiliza si la clave es la misma, y solo se vuelve a enviar la solicitud.
        try {
          usuario = (await signInWithEmailAndPassword(this.fb.auth, correo.trim(), clave)).user;
        } catch {
          return 'correoEnUso';
        }
      }
      if ((await getDoc(doc(this.fb.db, 'docentes', usuario.uid))).exists()) return 'yaEsDocente';
      const ref = doc(this.fb.db, 'solicitudes', usuario.uid);
      if ((await getDoc(ref)).exists()) return 'yaPendiente';
      await setDoc(ref, {
        nombre: nombre.trim().slice(0, 40),
        correo: correo.trim().toLowerCase().slice(0, 120),
        creado: Date.now(),
      });
      await signOut(this.fb.auth);
      return 'ok';
    } catch (err) {
      const codigo = (err as { code?: string }).code ?? '';
      if (codigo === 'auth/weak-password') return 'claveDebil';
      if (codigo === 'auth/invalid-email') return 'correoInvalido';
      console.warn('No se pudo registrar al docente:', err);
      return 'error';
    } finally {
      // Si algo falló a medias, no se deja una sesión de no-docente abierta.
      const actual = this.fb.auth.currentUser;
      if (actual && !actual.isAnonymous && !this._usuario()) await signOut(this.fb.auth).catch(() => undefined);
      this.ocupado = false;
      await this.asegurarSesionAnonima();
    }
  }

  /** Tras cerrar la sesión de una cuenta que no es de docente, vuelve la sesión anónima del estudiante. */
  private async asegurarSesionAnonima(): Promise<void> {
    const auth = this.fb.auth;
    if (!auth || auth.currentUser) return;
    try {
      await signInAnonymously(auth);
    } catch (err) {
      console.warn('No se pudo reabrir la sesión anónima:', err);
    }
  }

  /** Envía el correo para elegir una clave nueva. Siempre responde igual, exista o no la cuenta. */
  async restablecerClave(correo: string): Promise<boolean> {
    if (!this.fb.auth || !correo.trim()) return false;
    try {
      await sendPasswordResetEmail(this.fb.auth, correo.trim());
    } catch (err) {
      const codigo = (err as { code?: string }).code ?? '';
      if (codigo === 'auth/invalid-email') return false;
      // user-not-found y demás: no se revela si la cuenta existe
    }
    return true;
  }

  async logout(): Promise<void> {
    this._usuario.set(null);
    this._uid.set(null);
    sessionStorage.removeItem(CLAVE_SESION);
    if (this.fb.auth) await signOut(this.fb.auth);
  }

  tieneRol(roles: Role[]): boolean {
    return roles.includes(this.rol());
  }

  /** Es docente solo si existe `docentes/{uid}` en Firestore. Sin campo `rol` cuenta como administrador. */
  private async aplicarDocente(user: User): Promise<boolean> {
    try {
      const snap = await getDoc(doc(this.fb.db!, 'docentes', user.uid));
      if (!snap.exists()) return false;
      const datos = snap.data();
      const nombre = (datos['nombre'] as string | undefined) ?? user.email ?? 'Docente';
      const rol = datos['rol'] === 'docente' ? Role.DOCENTE : Role.ADMIN;
      this._uidEstudiante.set(null);
      this._uid.set(user.uid);
      this._usuario.set({ usuario: user.email ?? user.uid, nombre, rol });
      return true;
    } catch {
      return false;
    }
  }

  private loginLocal(usuario: string, clave: string): boolean {
    const cred = ADMINS.find((a) => a.usuario === usuario.trim().toLowerCase() && a.clave === clave);
    if (!cred) return false;
    const sesion: SesionUsuario = { usuario: cred.usuario, nombre: cred.nombre, rol: Role.ADMIN };
    this._usuario.set(sesion);
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return true;
  }

  private leerSesion(): SesionUsuario | null {
    try {
      const raw = sessionStorage.getItem(CLAVE_SESION);
      return raw ? (JSON.parse(raw) as SesionUsuario) : null;
    } catch {
      return null;
    }
  }
}
