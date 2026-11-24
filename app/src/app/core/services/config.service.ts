import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Nivel } from '../models/banco.model';
import { AjustesNubeService } from './ajustes-nube.service';
import { AuthService } from './auth.service';

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
  private readonly nube = inject(AjustesNubeService);
  private readonly auth = inject(AuthService);
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

    // Firebase → pantalla (el mensaje del día y el público los define el docente para todos).
    effect(() => {
      const r = this.nube.datos();
      if (!r) return;
      untracked(() => {
        if (r.mensajeDelDia !== undefined) this.mensajeDelDia.set(r.mensajeDelDia);
        if (r.nivel !== undefined) this.nivel.set(r.nivel);
      });
    });

    // Pantalla → Firebase (solo docente; espera a que deje de escribir para no guardar cada letra).
    effect((onCleanup) => {
      const mensajeDelDia = this.mensajeDelDia();
      const nivel = this.nivel();
      if (!this.nube.activo || !this.auth.esDocente()) return;
      const r = untracked(() => this.nube.datos());
      if (r && r.mensajeDelDia === mensajeDelDia && r.nivel === nivel) return;
      const t = setTimeout(() => void this.nube.guardar({ mensajeDelDia, nivel }), 600);
      onCleanup(() => clearTimeout(t));
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
