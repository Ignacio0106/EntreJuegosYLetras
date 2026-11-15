import { Component, inject } from '@angular/core';
import { ADIVINANZAS } from '../../../core/data/banco-literario.data';
import { BancoService } from '../../../core/services/banco.service';
import { QuizConfig, QuizJuego } from '../../../shared/components/quiz-juego/quiz-juego';

/** El libro misterioso: adivinanzas que se pueden escuchar con el botón de audio. */
@Component({
  selector: 'app-misterioso-game',
  imports: [QuizJuego],
  template: `<app-quiz-juego [config]="config" />`,
})
export class MisteriosoGame {
  private readonly banco = inject(BancoService);
  protected readonly config: QuizConfig = {
    slug: 'misterioso',
    titulo: 'El libro misterioso',
    mensaje: 'Del libro sale una adivinanza. Léela o toca el altavoz para escucharla, y elige la respuesta.',
    aprendemos: 'Escucha atenta e imaginación: las adivinanzas esconden pistas en cada palabra.',
    boton: 'Abrir el libro',
    etiquetaProgreso: 'Adivinanza',
    textoAcierto: '¡Descubriste el misterio!',
    generar: () => {
      const todas = this.banco.filtrarOTodo(ADIVINANZAS, 6);
      return this.banco.barajar(todas).slice(0, 8).map((a) => {
        const otras = this.banco
          .barajar(ADIVINANZAS.filter((x) => x.a !== a.a))
          .slice(0, 3)
          .map((x) => x.a);
        return { etiqueta: 'Adivinanza del libro misterioso', pregunta: a.q, opciones: [a.a, ...otras], correcta: 0 };
      });
    },
    tituloFinal: (a, t) => `¡Resolviste ${a} de ${t} misterios!`,
    textoFinal: 'Ahora inventa tu propia adivinanza y reta a alguien de tu casa.',
  };
}
