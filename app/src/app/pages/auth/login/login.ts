import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

type Modo = 'entrar' | 'registro';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly modo = signal<Modo>('entrar');
  protected nombre = '';
  protected usuario = '';
  protected clave = '';
  protected readonly error = signal('');
  protected readonly aviso = signal('');
  protected readonly verClave = signal(false);
  protected readonly cargando = signal(false);
  protected readonly usaNube = this.auth.usaNube;

  protected cambiarModo(m: Modo): void {
    this.modo.set(m);
    this.error.set('');
    this.aviso.set('');
    this.clave = '';
  }

  protected async entrar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    this.aviso.set('');
    const r = await this.auth.login(this.usuario, this.clave);
    this.cargando.set(false);
    if (r === 'ok') {
      const volver = this.route.snapshot.queryParamMap.get('volver');
      void this.router.navigateByUrl(volver && volver.startsWith('/') ? volver : '/admin');
      return;
    }
    const textos = {
      incorrecto: (this.usaNube ? 'Correo o clave incorrectos.' : 'Usuario o clave incorrectos.') + ' Revisa e inténtalo de nuevo.',
      pendiente: 'Tu solicitud todavía está pendiente. Cuando un administrador la apruebe, podrás entrar con este mismo correo y clave.',
      noDocente: 'Esa cuenta no es de docente (o se le quitó el acceso). Para pedirlo otra vez, usa "Crear cuenta de docente" con este mismo correo y la misma clave.',
    };
    this.error.set(textos[r]);
  }

  protected async olvide(): Promise<void> {
    this.error.set('');
    this.aviso.set('');
    if (!this.usuario.trim()) { this.error.set('Escribe primero tu correo y luego pulsa "¿Olvidaste tu clave?".'); return; }
    this.cargando.set(true);
    const ok = await this.auth.restablecerClave(this.usuario);
    this.cargando.set(false);
    if (ok) this.aviso.set('Si ese correo tiene cuenta, te enviamos un mensaje para elegir una clave nueva. Revisa también la carpeta de spam.');
    else this.error.set('Ese correo no parece válido. Revísalo e inténtalo de nuevo.');
  }

  protected async registrarse(): Promise<void> {
    this.error.set('');
    this.aviso.set('');
    if (this.nombre.trim().length < 2) { this.error.set('Escribe tu nombre para que el administrador sepa quién eres.'); return; }
    this.cargando.set(true);
    const r = await this.auth.registrarDocente(this.nombre, this.usuario, this.clave);
    this.cargando.set(false);
    if (r === 'ok') {
      this.clave = '';
      this.modo.set('entrar');
      this.aviso.set('¡Solicitud enviada! Un administrador debe aprobarla. Después podrás entrar con tu correo y tu clave.');
      return;
    }
    if (r === 'yaPendiente') {
      this.clave = '';
      this.modo.set('entrar');
      this.aviso.set('Tu solicitud ya estaba enviada y sigue pendiente. Espera a que un administrador la apruebe.');
      return;
    }
    const textos = {
      yaEsDocente: 'Esa cuenta ya es de docente. Entra desde la pestaña "Entrar".',
      correoEnUso: 'Ese correo ya tiene cuenta, pero la clave no coincide. Escribe la misma clave de siempre, o usa "¿Olvidaste tu clave?" en la pestaña Entrar.',
      claveDebil: 'La clave es muy corta. Usa al menos 6 caracteres.',
      correoInvalido: 'Ese correo no parece válido. Revísalo e inténtalo de nuevo.',
      error: 'No pudimos enviar tu solicitud. Revisa tu internet e inténtalo otra vez.',
    };
    this.error.set(textos[r]);
  }
}
