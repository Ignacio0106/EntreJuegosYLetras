import { Type } from '@angular/core';

/** Carga perezosa: cada juego es un "chunk" aparte, solo se descarga cuando se abre. */
export const JUEGOS_CARGADORES: Record<string, () => Promise<Type<unknown>>> = {
  preguntas: () => import('./preguntas.game').then((m) => m.PreguntasGame),
  lectura: () => import('./lectura.game').then((m) => m.LecturaGame),
  ordenar: () => import('./ordenar.game').then((m) => m.OrdenarGame),
  adivina: () => import('./adivina.game').then((m) => m.AdivinaGame),
  verdadero: () => import('./verdadero.game').then((m) => m.VerdaderoGame),
  misterioso: () => import('./misterioso.game').then((m) => m.MisteriosoGame),
  errores: () => import('./errores.game').then((m) => m.ErroresGame),
  silabas: () => import('./silabas.game').then((m) => m.SilabasGame),
  sopa: () => import('./sopa.game').then((m) => m.SopaGame),
  ahorcado: () => import('./ahorcado.game').then((m) => m.AhorcadoGame),
  bingo: () => import('./bingo.game').then((m) => m.BingoGame),
  ruleta: () => import('./ruleta.game').then((m) => m.RuletaGame),
  memoria: () => import('./memoria.game').then((m) => m.MemoriaGame),
  millonario: () => import('./millonario.game').then((m) => m.MillonarioGame),
  refranes: () => import('./refranes.game').then((m) => m.RefranesGame),
  personaje: () => import('./personaje.game').then((m) => m.PersonajeGame),
  aventura: () => import('./aventura.game').then((m) => m.AventuraGame),
  dado: () => import('./dado.game').then((m) => m.DadoGame),
  trabalenguas: () => import('./trabalenguas.game').then((m) => m.TrabalenguasGame),
  rimas: () => import('./rimas.game').then((m) => m.RimasGame),
  diccionario: () => import('./diccionario.game').then((m) => m.DiccionarioGame),
  // ---- Juegos de acción (atrapar, reventar, pescar)
  atrapa: () => import('./atrapa.game').then((m) => m.AtrapaGame),
  lluvia: () => import('./lluvia.game').then((m) => m.LluviaGame),
  globos: () => import('./globos.game').then((m) => m.GlobosGame),
  topos: () => import('./topos.game').then((m) => m.ToposGame),
  pesca: () => import('./pesca.game').then((m) => m.PescaGame),
};
