import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CREDITOS } from '../../core/data/creditos.data';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly auth = inject(AuthService);
  protected readonly creditos = CREDITOS;
  protected readonly year = new Date().getFullYear();
}
