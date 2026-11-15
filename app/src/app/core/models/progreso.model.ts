export interface PerfilNino {
  nombre: string;
  avatar: string;
}

export interface AvanceJuego {
  estrellas: number;
  partidas: number;
  mejor: number;
}

export interface EstadoProgreso {
  perfil: PerfilNino;
  juegos: Record<string, AvanceJuego>;
  insignias: string[];
}

export interface ContextoInsignia {
  estrellas: number;
  juegosJugados: number;
  categoriasJugadas: number;
  juegosConTresEstrellas: number;
}

export interface Insignia {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  cumple: (c: ContextoInsignia) => boolean;
}
