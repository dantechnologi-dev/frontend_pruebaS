import { Component, OnInit,ChangeDetectorRef,Inject,PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; 
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  imports: [],
  selector: 'app-principal',
  styleUrl: './principal.css',
  templateUrl: './principal.html',
})
export class PrincipalComponent implements OnInit {

nombre: string = 'Cargando...';
  usuarioCompleto: string = 'Cargando...';
  rol: string = 'Cargando...';
  novedad: string = 'Bienvenido al sistema';

  constructor(
    private router: Router, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const idLogueado = localStorage.getItem('user_id');

      if (idLogueado) {
        //  Apunta al puerto 8080 de Spring Boot, incluye la ruta base /api/usuarios y usa la interpolación ${} correcta
        this.http.get(`http://localhost:8080/api/auth/usuario/${idLogueado}`).subscribe({

          next: (usuarioBD: any) => {
            this.nombre = usuarioBD.nombres;
            this.usuarioCompleto = `${usuarioBD.nombres} ${usuarioBD.apellidos}`;
            this.rol = usuarioBD.rol;
            this.cdr.detectChanges(); 
          },
          error: (error) => {
            console.error('Error al obtener datos del usuario desde la base de datos:', error);
            this.nombre = 'Usuario';
            this.usuarioCompleto = 'Usuario (Error de red)';
            this.rol = 'Usuario';
            this.cdr.detectChanges();
          }
        });
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  ir(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cerrarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user_id');
    }
    this.router.navigate(['/']);
  }

  irUsuarios(): void {
    this.router.navigate(['/usuarios']);
  }






}
