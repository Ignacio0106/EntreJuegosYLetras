import { Component, computed, effect, HostListener, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccesoService } from '../../core/services/acceso.service';
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
  private readonly acceso = inject(AccesoService);

  /** Otras pantallas piden "inicia o crea tu código": se abre el panel del perfil. */
  private readonly alPedirIniciar = effect(() => {
    if (this.acceso.peticion() === 0) return;
    untracked(() => {
      this.nombre = this.progreso.perfil().nombre;
      this.avatar = this.progreso.perfil().avatar;
      this.menu.set(false);
      this.panel.set('perfil');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  protected readonly avatares = AVATARES;
  protected readonly panel = signal<'perfil' | 'insignias' | 'docente' | null>(null);
  protected readonly menu = signal(false);
  /** El medidor y las insignias solo salen cuando el niño ya inició (tiene código); sin Firebase no hay códigos y salen siempre. */
  protected readonly iniciado = computed(() => !this.progreso.usaNube || !!this.progreso.codigo());
  protected nombre = '';
  protected avatar = '';

  protected abrir(cual: 'perfil' | 'insignias' | 'docente'): void {
    if (this.panel() === cual) { this.panel.set(null); return; }
    this.nombre = this.progreso.perfil().nombre;
    this.avatar = this.progreso.perfil().avatar;
    this.panel.set(cual);
  }

  protected codigoEscrito = '';
  protected readonly mensajeCodigo = signal<{ texto: string; ok: boolean } | null>(null);
  protected readonly buscandoCodigo = signal(false);

  protected codigoNuevo = '';
  protected readonly creandoCodigo = signal(false);

  protected sugerirCodigo(): void {
    this.codigoNuevo = ProgresoService.sugerirCodigo();
  }

  protected async crearCodigo(): Promise<void> {
    this.creandoCodigo.set(true);
    this.mensajeCodigo.set(null);
    const r = await this.progreso.crearCodigo(this.codigoNuevo);
    this.creandoCodigo.set(false);
    if (r === 'ok') {
      this.codigoNuevo = '';
      this.mensajeCodigo.set({ texto: '¡Listo! Ese es tu código. Anótalo para no olvidarlo.', ok: true });
      return;
    }
    const textos = {
      invalido: 'Usa de 4 a 14 letras o números, sin espacios raros. Por ejemplo SOFI2015.',
      repetido: 'Ese código ya lo tiene otra persona. Prueba agregándole un número, por ejemplo SOFI7.',
      error: 'No pudimos guardar tu código. Revisa tu internet e inténtalo otra vez.',
    };
    this.mensajeCodigo.set({ texto: textos[r], ok: false });
  }

  protected async usarCodigo(): Promise<void> {
    this.buscandoCodigo.set(true);
    this.mensajeCodigo.set(null);
    const ok = await this.progreso.usarCodigo(this.codigoEscrito);
    this.buscandoCodigo.set(false);
    if (ok) {
      this.codigoEscrito = '';
      this.nombre = this.progreso.perfil().nombre;
      this.avatar = this.progreso.perfil().avatar;
      this.mensajeCodigo.set({ texto: '¡Listo! Recuperamos tu avance.', ok: true });
    } else {
      this.mensajeCodigo.set({ texto: 'No encontramos ese código. Revisa que esté bien escrito.', ok: false });
    }
  }

  protected otroNino(): void {
    this.progreso.empezarComoOtro();
    this.nombre = this.progreso.perfil().nombre;
    this.avatar = this.progreso.perfil().avatar;
    this.mensajeCodigo.set({ texto: 'Cerraste tu sesión. ¡Hasta pronto!', ok: true });
  }

  protected guardar(): void {
    this.progreso.guardarPerfil({ nombre: this.nombre, avatar: this.avatar });
    this.panel.set(null);
  }

  /** Un clic fuera de los paneles (o del menú) los cierra. */
  @HostListener('document:click', ['$event'])
  protected alHacerClic(ev: MouseEvent): void {
    const camino = ev.composedPath().filter((n): n is Element => n instanceof Element);
    const dentro = (selector: string) => camino.some((el) => el.matches(selector));
    if (this.panel() && !dentro('.panel, .perfil, .insignias')) this.panel.set(null);
    if (this.menu() && !dentro('.menu, .hamburguesa')) this.menu.set(false);
  }

  @HostListener('document:keydown.escape')
  protected alPulsarEscape(): void {
    this.panel.set(null);
    this.menu.set(false);
  }

  protected async salir(): Promise<void> {
    this.panel.set(null);
    await this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
