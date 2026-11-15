import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mascota } from '../../../shared/components/mascota/mascota';

@Component({
  selector: 'app-sin-autorizacion',
  imports: [RouterLink, Mascota],
  templateUrl: './sin-autorizacion.html',
  styleUrl: './sin-autorizacion.css',
})
export class SinAutorizacion {}
