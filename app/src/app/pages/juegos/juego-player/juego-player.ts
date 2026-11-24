import { NgComponentOutlet } from '@angular/common';
import { Component, computed, effect, inject, input, signal, Type } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccesoService } from '../../../core/services/acceso.service';
import { JuegosService } from '../../../core/services/juegos.service';
import { ProgresoService } from '../../../core/services/progreso.service';
import { VozService } from '../../../core/services/voz.service';
import { Estrellas } from '../../../shared/components/estrellas/estrellas';
import { JUEGOS_CARGADORES } from '../games/games.registry';

@Component({
  selector: 'app-juego-player',
  imports: [NgComponentOutlet, RouterLink, Estrellas],
  templateUrl: './juego-player.html',
  styleUrl: './juego-player.css',
})
export class JuegoPlayer {
  private readonly juegos = inject(JuegosService);
  private readonly progreso = inject(ProgresoService);
  protected readonly acceso = inject(AccesoService);
  private readonly voz = inject(VozService);

  /** Viene de la ruta /juegos/:slug (withComponentInputBinding). */
  readonly slug = input.required<string>();

  protected readonly juego = computed(() => this.juegos.buscar(this.slug()));
  protected readonly estrellas = computed(() => this.progreso.estrellasDe(this.slug()));
  protected readonly componente = signal<Type<unknown> | null>(null);
  protected readonly error = signal(false);
  protected readonly puede = this.progreso.puedeJugar;

  constructor() {
    effect(() => {
      const cargador = JUEGOS_CARGADORES[this.slug()];
      this.componente.set(null);
      this.error.set(false);
      this.voz.detener();
      if (!cargador) { this.error.set(true); return; }
      if (!this.puede()) return; // sin sesión solo se ve de qué trata, no se carga el juego
      cargador().then((c) => this.componente.set(c)).catch(() => this.error.set(true));
    });
  }
}
