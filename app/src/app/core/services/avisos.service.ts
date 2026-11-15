import { inject, Injectable, signal } from '@angular/core';
import { BancoService } from './banco.service';

export interface Toast { id: number; texto: string; }
export interface Sabias { titulo?: string; texto: string; }
export interface Aviso { titulo: string; texto: string; boton?: string; alCerrar?: () => void; }

/** Mensajes flotantes: toasts breves, "¿Sabías qué?" y avisos con botón. */
@Injectable({ providedIn: 'root' })
export class AvisosService {
  private readonly banco = inject(BancoService);
  private contador = 0;
  private temporizadorSabias: ReturnType<typeof setTimeout> | null = null;

  readonly toasts = signal<Toast[]>([]);
  readonly sabias = signal<Sabias | null>(null);
  readonly aviso = signal<Aviso | null>(null);

  toast(texto: string): void {
    const id = ++this.contador;
    this.toasts.update((t) => [...t, { id, texto }]);
    setTimeout(() => this.toasts.update((t) => t.filter((x) => x.id !== id)), 2200);
  }

  /** Muestra un dato curioso. Sin argumentos elige uno al azar del banco. */
  mostrarSabias(titulo?: string, texto?: string): void {
    const t = texto ?? this.banco.datoSabias();
    if (!t) return;
    this.sabias.set({ titulo, texto: t });
    if (this.temporizadorSabias) clearTimeout(this.temporizadorSabias);
    this.temporizadorSabias = setTimeout(() => this.sabias.set(null), 9000);
  }

  cerrarSabias(): void {
    this.sabias.set(null);
  }

  mostrarAviso(titulo: string, texto: string, boton = '¡Seguir!', alCerrar?: () => void): void {
    this.aviso.set({ titulo, texto, boton, alCerrar });
  }

  cerrarAviso(): void {
    const a = this.aviso();
    this.aviso.set(null);
    a?.alCerrar?.();
  }
}
