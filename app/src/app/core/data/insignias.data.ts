import { Insignia } from '../models/progreso.model';

export const META_ESTRELLAS = 30;
export const LIBROS_MEDIDOR = 10;

export const INSIGNIAS: Insignia[] = [
  { id: 'primer-paso', nombre: 'Primer paso', icono: '🌱',
    descripcion: 'Terminaste tu primer juego.', cumple: (c) => c.juegosJugados >= 1 },
  { id: 'curioso', nombre: 'Lector curioso', icono: '🔎',
    descripcion: 'Probaste 5 juegos distintos.', cumple: (c) => c.juegosJugados >= 5 },
  { id: 'explorador', nombre: 'Explorador', icono: '🧭',
    descripcion: 'Jugaste en las 4 islas de juegos.', cumple: (c) => c.categoriasJugadas >= 4 },
  { id: 'cazaestrellas', nombre: 'Cazaestrellas', icono: '⭐',
    descripcion: 'Juntaste 10 estrellas.', cumple: (c) => c.estrellas >= 10 },
  { id: 'brillante', nombre: 'Brillante', icono: '🏅',
    descripcion: 'Sacaste 3 estrellas en 3 juegos.', cumple: (c) => c.juegosConTresEstrellas >= 3 },
  { id: 'super-lector', nombre: 'Super lector', icono: '📚',
    descripcion: 'Llenaste el medidor con 30 estrellas.', cumple: (c) => c.estrellas >= META_ESTRELLAS },
];
