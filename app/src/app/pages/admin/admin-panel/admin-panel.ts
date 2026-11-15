import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Nivel } from '../../../core/models/banco.model';
import { AuthService } from '../../../core/services/auth.service';
import { AvisosService } from '../../../core/services/avisos.service';
import { ConfigService } from '../../../core/services/config.service';
import { JuegosService } from '../../../core/services/juegos.service';
import { ProgresoService } from '../../../core/services/progreso.service';

type Pestana = 'juegos' | 'ajustes' | 'uso';

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  protected readonly juegos = inject(JuegosService);
  protected readonly config = inject(ConfigService);
  protected readonly progreso = inject(ProgresoService);
  protected readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisosService);

  protected readonly pestana = signal<Pestana>('juegos');
  protected readonly busqueda = signal('');
  protected readonly niveles: { id: Nivel; titulo: string; ayuda: string }[] = [
    { id: 'N', titulo: 'Niñas y niños', ayuda: 'Escuela y colegio (recomendado)' },
    { id: 'M', titulo: 'Personas adultas mayores', ayuda: 'Hogares y casas de la cultura' },
    { id: 'T', titulo: 'Todo público', ayuda: 'Mezcla de todo el contenido' },
  ];

  protected readonly grupos = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.juegos.categorias
      .map((cat) => ({
        cat,
        juegos: this.juegos.todos().filter(
          (j) => j.categoria === cat.id && (!q || (j.titulo + ' ' + j.habilidad).toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.juegos.length);
  });

  protected readonly usos = computed(() =>
    this.juegos
      .todos()
      .map((j) => ({ ...j, partidas: this.progreso.partidasDe(j.slug), estrellas: this.progreso.estrellasDe(j.slug) }))
      .sort((a, b) => b.partidas - a.partidas)
  );
  protected readonly totalPartidas = computed(() => this.usos().reduce((n, u) => n + u.partidas, 0));

  protected cambiarCategoria(slugs: string[], valor: boolean): void {
    this.juegos.establecerVarios(slugs, valor);
  }

  protected todos(valor: boolean): void {
    this.juegos.establecerVarios(this.juegos.todos().map((j) => j.slug), valor);
    this.avisos.toast(valor ? 'Todos los juegos están activos' : 'Todos los juegos están desactivados');
  }

  protected restablecerJuegos(): void {
    this.juegos.restablecer();
    this.avisos.toast('Juegos restablecidos');
  }

  protected borrarProgreso(): void {
    if (confirm('¿Borrar las estrellas e insignias de este equipo? No se puede deshacer.')) {
      this.progreso.reiniciar();
      this.avisos.toast('Progreso borrado');
    }
  }
}
