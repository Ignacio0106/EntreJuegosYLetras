import { inject, Injectable } from '@angular/core';
import { SABIAS } from '../data/banco-literario.data';
import { Nivel } from '../models/banco.model';
import { ConfigService } from './config.service';

const NIVELES_OK: Record<Nivel, Record<Nivel, boolean>> = {
  N: { N: true, T: true, M: false },
  M: { M: true, T: true, N: false },
  T: { N: true, M: true, T: true },
};

/** Utilidades para trabajar con el banco literario: filtrar por público y barajar. */
@Injectable({ providedIn: 'root' })
export class BancoService {
  private readonly config = inject(ConfigService);
  private sabiasVistas: string[] = [];

  /** Filtra por el público elegido por el docente (niñas y niños, mayores o todos). */
  filtrar<T>(lista: T[]): T[] {
    const ok = NIVELES_OK[this.config.nivel()];
    return lista.filter((x) => {
      const o = x as { nivel?: Nivel; t?: string; n?: Nivel };
      const lv: Nivel = o.nivel ?? (o.t && o.n ? o.n : 'T');
      return ok[lv];
    });
  }

  /** Igual que filtrar, pero si quedan muy pocos elementos usa la lista completa. */
  filtrarOTodo<T>(lista: T[], minimo = 1): T[] {
    const f = this.filtrar(lista);
    return f.length >= minimo ? f : lista.slice();
  }

  barajar<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Baraja las opciones y devuelve el nuevo índice de la respuesta correcta. */
  mezclar(opciones: string[], correcta: number): { opciones: string[]; resp: number } {
    const arr = this.barajar(opciones.map((o, r) => ({ o, r })));
    return { opciones: arr.map((x) => x.o), resp: arr.findIndex((x) => x.r === correcta) };
  }

  azar<T>(lista: T[]): T {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  /** Un dato "¿Sabías qué?" que no se repita enseguida. */
  datoSabias(): string | null {
    let banco = this.filtrar(SABIAS);
    if (!banco.length) banco = SABIAS;
    if (!banco.length) return null;
    let pendientes = banco.filter((s) => !this.sabiasVistas.includes(s.x));
    if (!pendientes.length) {
      this.sabiasVistas = [];
      pendientes = banco;
    }
    const pick = this.azar(pendientes);
    this.sabiasVistas.push(pick.x);
    if (this.sabiasVistas.length > 14) this.sabiasVistas.shift();
    return pick.x;
  }

  /** Quita tildes y deja solo A-Z (para sopa de letras y ahorcado). */
  normalizar(texto: string): string {
    return texto.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
