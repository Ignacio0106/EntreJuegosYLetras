import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { EfectosService } from '../../core/services/efectos.service';
import { AVATARES, ProgresoService } from '../../core/services/progreso.service';

/** Barra fija: perfil, medidor de lectura, insignias y ajustes rápidos. */
@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly progreso = inject(ProgresoService);
  protected readonly config = inject(ConfigService);
  protected readonly efectos = inject(EfectosService);
  private readonly router = inject(Router);

  protected readonly avatares = AVATARES;
  protected readonly panel = signal<'perfil' | 'insignias' | null>(null);
  protected readonly menu = signal(false);
  protected nombre = '';
  protected avatar = '';

  protected abrir(cual: 'perfil' | 'insignias'): void {
    if (this.panel() === cual) { this.panel.set(null); return; }
    this.nombre = this.progreso.perfil().nombre;
    this.avatar = this.progreso.perfil().avatar;
    this.panel.set(cual);
  }

  protected guardar(): void {
    this.progreso.guardarPerfil({ nombre: this.nombre, avatar: this.avatar });
    this.panel.set(null);
  }

  protected salir(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
