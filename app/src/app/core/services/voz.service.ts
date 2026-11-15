import { Injectable, signal } from '@angular/core';

/** Lectura en voz alta con la voz del navegador (Web Speech API). Sin internet ni archivos. */
@Injectable({ providedIn: 'root' })
export class VozService {
  readonly soportado = typeof window !== 'undefined' && 'speechSynthesis' in window;
  /** Identificador del texto que se está leyendo (o null). */
  readonly hablando = signal<string | null>(null);

  hablar(texto: string, id: string): void {
    if (!this.soportado) return;
    this.detener();
    const u = new SpeechSynthesisUtterance(texto);
    const voces = speechSynthesis.getVoices();
    const voz =
      voces.find((v) => v.lang.toLowerCase().startsWith('es-cr')) ??
      voces.find((v) => v.lang.toLowerCase().startsWith('es-419')) ??
      voces.find((v) => v.lang.toLowerCase().startsWith('es-mx')) ??
      voces.find((v) => v.lang.toLowerCase().startsWith('es'));
    if (voz) u.voice = voz;
    u.lang = voz?.lang ?? 'es-ES';
    u.rate = 0.9;
    u.onend = () => this.hablando.update((h) => (h === id ? null : h));
    u.onerror = u.onend;
    this.hablando.set(id);
    speechSynthesis.speak(u);
  }

  alternar(texto: string, id: string): void {
    if (this.hablando() === id) this.detener();
    else this.hablar(texto, id);
  }

  detener(): void {
    if (!this.soportado) return;
    speechSynthesis.cancel();
    this.hablando.set(null);
  }
}
