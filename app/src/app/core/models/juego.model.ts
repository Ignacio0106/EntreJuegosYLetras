export type CategoriaId = 'comprender' | 'palabras' | 'gente' | 'crear' | 'accion';
export type ColorTema = 'cielo' | 'menta' | 'sol' | 'coral' | 'lila';

export interface Categoria {
  id: CategoriaId;
  titulo: string;
  descripcion: string;
  color: ColorTema;
}

export interface Juego {
  slug: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaId;
  icono: string;
  edad: string;
  duracion: string;
  habilidad: string;
  /** Valor por defecto; el administrador puede cambiarlo desde el panel. */
  habilitado: boolean;
  nuevo?: boolean;
}

export interface JuegoEstado extends Juego {
  color: ColorTema;
}
