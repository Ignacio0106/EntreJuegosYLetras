import { Role } from './role.model';

export interface SesionUsuario {
  usuario: string;
  nombre: string;
  rol: Role;
}

export interface CredencialAdmin {
  usuario: string;
  clave: string;
  nombre: string;
}
