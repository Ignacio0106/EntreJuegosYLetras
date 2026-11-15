import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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

  protected usuario = '';
  protected clave = '';
  protected readonly error = signal('');
  protected readonly verClave = signal(false);

  protected entrar(): void {
    if (this.auth.login(this.usuario, this.clave)) {
      const volver = this.route.snapshot.queryParamMap.get('volver');
      void this.router.navigateByUrl(volver && volver.startsWith('/') ? volver : '/admin');
    } else {
      this.error.set('Usuario o clave incorrectos. Revisa e inténtalo de nuevo.');
    }
  }
}
