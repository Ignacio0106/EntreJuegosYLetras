import { computed, Injectable, signal } from '@angular/core';
import { ADMINS } from '../data/usuarios.data';
import { Role } from '../models/role.model';
import { SesionUsuario } from '../models/usuario.model';

const CLAVE_SESION = 'jdl-sesion';

/**
 * Autenticación sin base de datos.
 * - Estudiante: es el rol por defecto, no necesita iniciar sesión.
 * - Admin: credenciales "quemadas" en core/data/usuarios.data.ts.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _usuario = signal<SesionUsuario | null>(this.leerSesion());

  readonly usuario = this._usuario.asReadonly();
  readonly rol = computed(() => this._usuario()?.rol ?? Role.ESTUDIANTE);
  readonly esAdmin = computed(() => this.rol() === Role.ADMIN);

  login(usuario: string, clave: string): boolean {
    const cred = ADMINS.find(
      (a) => a.usuario === usuario.trim().toLowerCase() && a.clave === clave
    );
    if (!cred) return false;
    const sesion: SesionUsuario = { usuario: cred.usuario, nombre: cred.nombre, rol: Role.ADMIN };
    this._usuario.set(sesion);
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return true;
  }

  logout(): void {
    this._usuario.set(null);
    sessionStorage.removeItem(CLAVE_SESION);
  }

  tieneRol(roles: Role[]): boolean {
    return roles.includes(this.rol());
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
