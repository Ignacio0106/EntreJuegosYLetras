import { Component, inject } from '@angular/core';
import { VOF } from '../../../core/data/banco-literario.data';
import { BancoService } from '../../../core/services/banco.service';
import { QuizConfig, QuizJuego } from '../../../shared/components/quiz-juego/quiz-juego';

@Component({
  selector: 'app-verdadero-game',
  imports: [QuizJuego],
  template: `<app-quiz-juego [config]="config" />`,
})
export class VerdaderoGame {
  private readonly banco = inject(BancoService);
  protected readonly config: QuizConfig = {
    slug: 'verdadero',
    titulo: '¿Será verdad o mentira?',
    mensaje: 'Sale una afirmación sobre libros, autores, personajes o leyendas. Decide si es verdadera o falsa.',
    aprendemos: 'Pensamiento crítico: pensar antes de responder y explicar por qué.',
    boton: 'Comenzar a jugar',
    etiquetaProgreso: 'Afirmación',
    textoAcierto: '¡Muy bien!',
    generar: () =>
      this.banco.barajar(this.banco.filtrarOTodo(VOF)).slice(0, 12).map((v) => ({
        etiqueta: 'Categoría: ' + v.c,
        pregunta: v.t,
        opciones: ['Verdadero', 'Falso'],
        correcta: v.v ? 0 : 1,
        dato: this.banco.datoSabias() ?? undefined,
      })),
    tituloFinal: (a, t) => `${a} de ${t} correctas`,
    textoFinal: '¡Gracias por pensar y leer con calma! Vuelve a jugar cuando quieras.',
  };
}
