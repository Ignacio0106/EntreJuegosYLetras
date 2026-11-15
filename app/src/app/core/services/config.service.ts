import { effect, Injectable, signal } from '@angular/core';
import { Nivel } from '../models/banco.model';

const CLAVE = 'jdl-config';

interface Ajustes {
  mensajeDelDia: string;
  nivel: Nivel;
  letraGrande: boolean;
}

const POR_DEFECTO: Ajustes = {
  mensajeDelDia: 'Hoy leemos, jugamos y nos reímos. ¡Pura vida!',
  nivel: 'N',
  letraGrande: false,
};

/** Ajustes generales. El docente cambia mensaje y público; cualquiera puede activar letra grande. */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly inicial = this.leer();
  readonly mensajeDelDia = signal(this.inicial.mensajeDelDia);
  readonly nivel = signal<Nivel>(this.inicial.nivel);
  readonly letraGrande = signal(this.inicial.letraGrande);

  constructor() {
    effect(() => {
      const ajustes: Ajustes = {
        mensajeDelDia: this.mensajeDelDia(),
        nivel: this.nivel(),
        letraGrande: this.letraGrande(),
      };
      localStorage.setItem(CLAVE, JSON.stringify(ajustes));
      document.body.classList.toggle('letra-grande', ajustes.letraGrande);
    });
  }

  restablecer(): void {
    this.mensajeDelDia.set(POR_DEFECTO.mensajeDelDia);
    this.nivel.set(POR_DEFECTO.nivel);
  }

  private leer(): Ajustes {
    try {
      const raw = localStorage.getItem(CLAVE);
      return raw ? { ...POR_DEFECTO, ...(JSON.parse(raw) as Partial<Ajustes>) } : POR_DEFECTO;
    } catch {
      return POR_DEFECTO;
    }
  }
}
