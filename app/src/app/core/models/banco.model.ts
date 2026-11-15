/** Nivel del contenido: N = niñas y niños · M = personas adultas mayores · T = todo público */
export type Nivel = 'N' | 'M' | 'T';

export interface Libro { t: string; a: string; y: number; n: Nivel; s: string; }
export interface Personaje { n: string; l: string; nivel: Nivel; p: string[]; }
export interface Leyenda { n: string; nivel: Nivel; p: string[]; }
export interface Autor { n: string; nivel: Nivel; o: string[]; p: string[]; }
export interface Pregunta { p: string; o: string[]; r: number; nivel: Nivel; c: string; }
export interface Adivinanza { q: string; a: string; nivel: Nivel; }
export interface Trabalengua { t: string; nivel: Nivel; }
export interface Refran { i: string; f: string; nivel: Nivel; }
export interface Afirmacion { t: string; v: boolean; nivel: Nivel; c: string; }
export interface Historia { t: string; nivel: Nivel; pasos: string[]; }
export interface Sabia { x: string; nivel: Nivel; }
export interface Lectura {
  t: string; nivel: Nivel; fuente: string; texto: string;
  opciones: string[][]; correctas: number[]; dato?: string;
}
export interface DadoItem { x: string; nivel: Nivel; }
export interface Dados {
  personajes: DadoItem[]; lugares: DadoItem[]; problemas: DadoItem[]; objetos: DadoItem[];
}
export interface Silaba { p: string; sil: string[]; pista: string; nivel: Nivel; }
export interface PreguntaLectura { p: string; ops: string[]; r: number; }
export interface LecturaConPreguntas {
  t: string; nivel: Nivel; fuente: string; texto: string;
  preguntas: PreguntaLectura[]; dato?: string;
}
export interface ErrorOrtografico { mal: string; bien: string; }
export interface FraseConErrores {
  texto: string; errores: ErrorOrtografico[]; nivel: Nivel; pista?: string;
}
export interface PalabraTica { p: string; ops: string[]; r: number; uso: string; nivel: Nivel; }
export interface Rima { verso: string; ops: string[]; r: number; nivel: Nivel; dato?: string; }
export interface NodoAventura {
  texto: string;
  opciones?: { t: string; va: string }[];
  final?: boolean;
  moraleja?: string;
}
export interface Aventura {
  t: string; nivel: Nivel; inicio: string; nodos: Record<string, NodoAventura>;
}
