import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ProductosComponent } from './productos/productos'; 
import {PrincipalComponent} from './principal/principal';
import { UsuariosComponent } from './usuarios/usuarios';



export const routes: Routes = [
  // 1. Redirigir la ruta raíz ('') a '/login'
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Definir la ruta del Login
  { path: 'login', component: LoginComponent },

  //Ruta para principal
  {path: 'principal',component: PrincipalComponent},

  // 3. Agrega la ruta para Productos
  { path: 'usuarios', component: UsuariosComponent },
// 3. Agrega la ruta para Productos
  { path: 'productos', component: ProductosComponent }

// 3. Agrega la ruta para Proveedores
 

  
];
