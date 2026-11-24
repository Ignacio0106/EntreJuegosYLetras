import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { juegoHabilitadoGuard } from './core/guards/juego-habilitado.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/role.model';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home, title: '¡El juego de leer!' },
      // Estudiantes: entran directo, sin login. Solo se bloquea si el admin desactivó el juego.
      {
        path: 'juegos/:slug',
        loadComponent: () => import('./pages/juegos/juego-player/juego-player').then((m) => m.JuegoPlayer),
        title: 'A jugar',
        canActivate: [juegoHabilitadoGuard],
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
        title: 'Entrada para docentes',
      },
      // Solo administrador
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin-panel/admin-panel').then((m) => m.AdminPanel),
        title: 'Panel docente',
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN, Role.DOCENTE] },
      },
      {
        path: 'sin-autorizacion',
        loadComponent: () =>
          import('./pages/auth/sin-autorizacion/sin-autorizacion').then((m) => m.SinAutorizacion),
        title: 'No autorizado',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
