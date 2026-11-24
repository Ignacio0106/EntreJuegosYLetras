import { inject, Injectable, signal } from '@angular/core';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Nivel } from '../models/banco.model';
import { FirebaseService } from './firebase.service';

export interface AjustesNube {
  juegos?: Record<string, boolean>;
  mensajeDelDia?: string;
  nivel?: Nivel;
}

/** Documento `ajustes/general` de Firestore: juegos activados, mensaje del día y público. Lectura en vivo. */
@Injectable({ providedIn: 'root' })
export class AjustesNubeService {
  private readonly fb = inject(FirebaseService);
  private readonly _datos = signal<AjustesNube | null>(null);

  readonly activo = this.fb.activo;
  /** Último valor recibido de la nube (null mientras no llegue nada). */
  readonly datos = this._datos.asReadonly();
  /** Se resuelve con el primer dato (o error / 3 s), para que las rutas no esperen para siempre. */
  readonly listo: Promise<void>;

  constructor() {
    if (!this.fb.db) {
      this.listo = Promise.resolve();
      return;
    }
    this.listo = new Promise<void>((resolver) => {
      setTimeout(resolver, 3000);
      onSnapshot(
        doc(this.fb.db!, 'ajustes', 'general'),
        (snap) => {
          this._datos.set((snap.data() as AjustesNube | undefined) ?? {});
          resolver();
        },
        (err) => {
          console.warn('No se pudieron leer los ajustes de Firebase:', err);
          resolver();
        }
      );
    });
  }

  /** Solo funciona con sesión de docente (lo exigen las reglas). Reemplaza únicamente los campos enviados. */
  async guardar(campos: AjustesNube): Promise<void> {
    if (!this.fb.db) return;
    try {
      await setDoc(doc(this.fb.db, 'ajustes', 'general'), campos, { mergeFields: Object.keys(campos) });
    } catch (err) {
      console.error('No se pudo guardar en Firebase:', err);
    }
  }
}
