import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';

export const routes: Routes = [
  // 1. Redirigir la ruta raíz ('') a '/login'
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Definir la ruta del Login
  { path: 'login', component: LoginComponent },
];
