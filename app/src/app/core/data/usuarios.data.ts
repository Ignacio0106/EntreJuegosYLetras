import { CredencialAdmin } from '../models/usuario.model';

/**
 * Login "quemado" (sin base de datos). Solo el personal docente/administrador inicia sesión.
 * Los estudiantes entran directo y no tienen que escribir nada.
 */
export const ADMINS: CredencialAdmin[] = [
  { usuario: 'admin', clave: 'admin123', nombre: 'Docente administrador' },
];
