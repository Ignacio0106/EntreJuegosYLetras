import { Component, inject } from '@angular/core';
import { RIMAS } from '../../../core/data/banco-literario.data';
import { BancoService } from '../../../core/services/banco.service';
import { QuizConfig, QuizJuego } from '../../../shared/components/quiz-juego/quiz-juego';

@Component({
  selector: 'app-rimas-game',
  imports: [QuizJuego],
  template: `<app-quiz-juego [config]="config" />`,
})
export class RimasGame {
  private readonly banco = inject(BancoService);
  protected readonly config: QuizConfig = {
    slug: 'rimas',
    titulo: '¿Qué palabra rima?',
    mensaje: 'Lee el verso y escoge la palabra que rima y completa la poesía. ¡Que suene bonito!',
    aprendemos: 'Poesía y sonido: la rima une los versos y le da música a las palabras.',
    boton: 'Comenzar a rimar',
    etiquetaProgreso: 'Rima',
    textoAcierto: '¡Rima perfecta!',
    generar: () =>
      this.banco.barajar(this.banco.filtrarOTodo(RIMAS)).map((r) => ({
        etiqueta: 'Completa el verso',
        pregunta: r.verso,
        opciones: r.ops,
        correcta: r.r,
        extra: r.dato,
      })),
    tituloFinal: (a, t) => `¡Completaste ${a} de ${t} rimas!`,
    textoFinal: 'La poesía también es leer con el corazón. ¡Sigue rimando!',
  };
}
