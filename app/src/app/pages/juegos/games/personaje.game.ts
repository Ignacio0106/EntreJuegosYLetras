import { Component, computed, signal } from '@angular/core';
import { PERSONAJES } from '../../../core/data/banco-literario.data';
import { AudioBtn } from '../../../shared/components/audio-btn/audio-btn';
import { GameShell } from '../../../shared/components/game-shell/game-shell';
import { JuegoBase } from '../../../shared/utils/juego-base';

interface Resultado { clave: string; icono: string; nombre: string; libro: string; rasgo: string; pistas: string[]; }
interface Pregunta { texto: string; respuestas: { texto: string; clave: string }[]; }

/** ¿Qué personaje eres? Cinco preguntas y un personaje de los cuentos costarricenses. */
const PERFILES: Record<string, { icono: string; busca: string; rasgo: string }> = {
  conejo: { icono: '🐰', busca: 'El Tío Conejo', rasgo: 'Eres astuto y ocurrente: siempre encuentras una salida ingeniosa.' },
  cocori: { icono: '🐢', busca: 'Cocorí', rasgo: 'Eres curioso y soñador: preguntas todo y miras el mundo con asombro.' },
  juan: { icono: '🛡️', busca: 'Juan Varela', rasgo: 'Eres valiente y leal: no te rindes cuando alguien te necesita.' },
  abuela: { icono: '👵', busca: 'La abuela de los cuentos', rasgo: 'Eres cálido y cuentero: juntas a todos para compartir una buena historia.' },
};

const PREGUNTAS: Pregunta[] = [
  { texto: 'Es sábado y no hay tarea. ¿Qué haces?', respuestas: [
    { texto: 'Invento un plan para ganarle una apuesta a mi mejor amigo.', clave: 'conejo' },
    { texto: 'Salgo a explorar y a preguntar por qué las cosas son como son.', clave: 'cocori' },
    { texto: 'Ayudo en lo que haga falta, aunque cueste trabajo.', clave: 'juan' },
    { texto: 'Reúno a mi familia para contar cuentos.', clave: 'abuela' } ] },
  { texto: 'Aparece un problema muy grande. ¿Cómo reaccionas?', respuestas: [
    { texto: 'Pienso rápido y busco el truco más inteligente.', clave: 'conejo' },
    { texto: 'Me pregunto qué hay detrás y quiero entenderlo.', clave: 'cocori' },
    { texto: 'Lo enfrento con todo mi valor.', clave: 'juan' },
    { texto: 'Cuento una historia para que todos se calmen.', clave: 'abuela' } ] },
  { texto: '¿Qué prefieres llevar en tu mochila?', respuestas: [
    { texto: 'Un cuaderno de ideas y trucos.', clave: 'conejo' },
    { texto: 'Una libreta para anotar todo lo que descubro.', clave: 'cocori' },
    { texto: 'Una bandera y mi mejor amigo.', clave: 'juan' },
    { texto: 'Mi libro de cuentos favorito.', clave: 'abuela' } ] },
  { texto: '¿Qué te hace sentir más orgulloso?', respuestas: [
    { texto: 'Salirme con la mía usando la cabeza.', clave: 'conejo' },
    { texto: 'Aprender algo nuevo cada día.', clave: 'cocori' },
    { texto: 'Cumplir una promesa difícil.', clave: 'juan' },
    { texto: 'Que alguien me diga «cuéntame otro».', clave: 'abuela' } ] },
  { texto: '¿Cómo es tu amistad ideal?', respuestas: [
    { texto: 'Divertida y llena de bromas.', clave: 'conejo' },
    { texto: 'Con mil preguntas y aventuras.', clave: 'cocori' },
    { texto: 'De las que se cuidan siempre.', clave: 'juan' },
    { texto: 'De las que se reúnen alrededor de una mesa a conversar.', clave: 'abuela' } ] },
];

@Component({
  selector: 'app-personaje-game',
  imports: [GameShell, AudioBtn],
  template: `
    <app-game-shell titulo="¿Qué personaje eres?"
      mensaje="Contesta cinco preguntas con lo primero que sientas. No hay respuestas malas."
      aprendemos="Conocer personajes de nuestros cuentos y pensar en cómo somos nosotros."
      boton="¡Descubrir mi personaje!" [fase]="fase()" [finalTitulo]="finalTitulo()" [finalTexto]="finalTexto()"
      [estrellas]="estrellasGanadas()" (iniciar)="iniciar()">
      @if (fase() === 'jugando' && pregunta(); as q) {
        <section class="tarjeta">
          <p class="progreso">Pregunta {{ n() + 1 }} de {{ preguntas.length }}</p>
          <div class="pregunta-caja"><span class="texto">{{ q.texto }}</span><app-audio-btn [texto]="q.texto" /></div>
          <div class="opciones">
            @for (r of respuestas(); track r.texto) {
              <button type="button" class="opcion-r" (click)="elegir(r.clave)">{{ r.texto }}</button>
            }
          </div>
        </section>
      }
      @if (fase() === 'final' && resultado(); as r) {
        <section class="tarjeta centro res">
          <p class="icono" aria-hidden="true">{{ r.icono }}</p>
          <h2>¡Te pareces a {{ r.nombre }}!</h2>
          <p class="rasgo">{{ r.rasgo }}</p>
          <p class="nota">Aparece en «{{ r.libro }}»</p>
          <ul>@for (p of r.pistas; track p) { <li>{{ p }}</li> }</ul>
          <app-audio-btn [texto]="r.nombre + '. ' + r.rasgo + ' ' + r.pistas.join(' ')" />
        </section>
      }
    </app-game-shell>
  `,
  styles: `
    .icono { font-size: 5rem; margin: 0; line-height: 1; }
    .rasgo { font: 700 1.3rem var(--f-titulo); }
    ul { text-align: left; display: inline-block; margin: .5rem 0 1rem; }
  `,
})
export class PersonajeGame extends JuegoBase {
  readonly slug = 'personaje';
  protected readonly preguntas = PREGUNTAS;
  protected readonly n = signal(0);
  protected readonly cuentas = signal<Record<string, number>>({});
  protected readonly resultado = signal<Resultado | null>(null);
  protected readonly pregunta = computed(() => this.preguntas[this.n()] ?? null);
  protected readonly respuestas = computed(() => this.banco.barajar(this.pregunta()?.respuestas ?? []));

  protected iniciar(): void {
    this.n.set(0);
    this.cuentas.set({});
    this.resultado.set(null);
    this.empezar();
  }

  protected elegir(clave: string): void {
    this.efectos.click();
    this.cuentas.update((c) => ({ ...c, [clave]: (c[clave] ?? 0) + 1 }));
    if (this.n() + 1 < this.preguntas.length) {
      this.n.update((n) => n + 1);
      return;
    }
    const cuentas = this.cuentas();
    const ganadora = Object.keys(PERFILES).sort((a, b) => (cuentas[b] ?? 0) - (cuentas[a] ?? 0))[0];
    const perfil = PERFILES[ganadora];
    const dato = PERSONAJES.find((p) => p.n === perfil.busca);
    this.resultado.set({
      clave: ganadora, icono: perfil.icono, nombre: dato?.n ?? perfil.busca, libro: dato?.l ?? '',
      rasgo: perfil.rasgo, pistas: dato?.p.slice(0, 3) ?? [],
    });
    this.terminar(1, 1, '¡Qué buen resultado!', 'Vuelve a jugar y cambia tus respuestas para conocer a otro personaje.');
  }
}
