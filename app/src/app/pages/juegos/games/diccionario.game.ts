import { Component, inject } from '@angular/core';
import { DICCIONARIO } from '../../../core/data/banco-literario.data';
import { BancoService } from '../../../core/services/banco.service';
import { QuizConfig, QuizJuego } from '../../../shared/components/quiz-juego/quiz-juego';

@Component({
  selector: 'app-diccionario-game',
  imports: [QuizJuego],
  template: `<app-quiz-juego [config]="config" />`,
})
export class DiccionarioGame {
  private readonly banco = inject(BancoService);
  protected readonly config: QuizConfig = {
    slug: 'diccionario',
    titulo: '¿Qué significa?',
    mensaje: 'Aparece una palabra o expresión costarricense. Elige el significado correcto.',
    aprendemos: 'Vocabulario y cultura: las palabras que usamos en Costa Rica cuentan nuestra historia.',
    boton: 'Abrir el diccionario',
    etiquetaProgreso: 'Palabra',
    destacada: true,
    generar: () =>
      this.banco.barajar(this.banco.filtrarOTodo(DICCIONARIO)).slice(0, 10).map((d) => ({
        etiqueta: '¿Qué significa…?',
        pregunta: d.p,
        opciones: d.ops,
        correcta: d.r,
        extra: 'Se usa así: ' + d.uso,
      })),
    tituloFinal: (a, t) => `¡Acertaste ${a} de ${t} palabras!`,
    textoFinal: 'Hablar como tico también es querer nuestra cultura. ¡Pura vida!',
  };
}
