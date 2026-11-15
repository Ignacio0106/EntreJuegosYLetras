import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DERECHOS, DERECHOS_INTRO } from '../../core/data/derechos.data';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { JuegosService } from '../../core/services/juegos.service';
import { ProgresoService } from '../../core/services/progreso.service';
import { AudioBtn } from '../../shared/components/audio-btn/audio-btn';
import { Estrellas } from '../../shared/components/estrellas/estrellas';
import { Mascota } from '../../shared/components/mascota/mascota';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AudioBtn, Estrellas, Mascota],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly juegos = inject(JuegosService);
  protected readonly progreso = inject(ProgresoService);
  protected readonly config = inject(ConfigService);
  protected readonly auth = inject(AuthService);

  protected readonly grupos = this.juegos.porCategoria;
  protected readonly derechos = DERECHOS;
  protected readonly derechosIntro = DERECHOS_INTRO;
  protected readonly hayJuegos = computed(() => this.grupos().length > 0);
  protected readonly saludo = computed(() => `¡Hola, ${this.progreso.perfil().nombre}!`);
  protected readonly textoHero =
    '¡El juego de leer! Explora, juega y lee. Elige una isla de juegos y empieza la aventura.';
}
