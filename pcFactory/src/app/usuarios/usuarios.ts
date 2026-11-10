import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core'; // 🟢 Agregamos Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // 🟢 Agregamos isPlatformBrowser
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
// Importamos el servicio de la interfaz del usuario
import {
  UsuariosService, Usuario, UsuarioFormulario
} from "./usuarios.service"

@Component({
  imports: [CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  selector: 'app-usuarios',
  styleUrl: './usuarios.css',
  templateUrl: './usuarios.html',
})
export class UsuariosComponent implements OnInit {

 // Generar el almacenamiento de los usuarios
  usuarios: Usuario[] = [];

  // Datos que se ingresan en el formulario
  formulario = {
    idUsuario: '',
    nombres: '',
    apellidos: '',
    passworduser: '',
    rol: 'ADMINISTRADOR'
  };

  // Variables para mostrar los datos en la tarjeta superior derecha
  usuarioCompleto: string = 'Cargando...';
  rolLogueado: string = 'Cargando...';

  // Variable para saber si se esta editando
  modoedicion: boolean = false;

  // texto para ubicar a los usuarios
  busqueda: string = '';

  // Inyectamos el servicio, ChangeDetectorRef, HttpClient y PLATFORM_ID
  constructor(
    private service: UsuariosService, 
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // 🟢 Inyección requerida
  ) { }

  // Se ejecuta automáticamente al abrir la pantalla.
  ngOnInit(): void {
    this.listarUsuarios();
    this.cargarUsuarioLogueado(); 
  }

  // Carga los datos directo desde la Base de Datos utilizando el DNI
  cargarUsuarioLogueado(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      const idLogueado = localStorage.getItem('user_dni');

      if (idLogueado) {
        
       this.http.get(`http://localhost:8080/api/usuarios/${idLogueado}`).subscribe({

          next: (usuarioBD: any) => {
            this.usuarioCompleto = `${usuarioBD.nombres} ${usuarioBD.apellidos}`;
            this.rolLogueado = usuarioBD.rol;
            
            // Forzamos el refresco visual de la tarjeta superior
            this.cdr.detectChanges(); 
          },
          error: (error) => {
            console.error('Error al obtener la sesión del usuario desde la BD:', error);
            this.usuarioCompleto = 'Usuario';
            this.rolLogueado = 'Usuario';
            this.cdr.detectChanges();
          }
        });
      }
    }
  }

  // Regresa a la pantalla anterior.
  regresar(): void {
    window.history.back();
  }

  // Consultar usuarios registrados en mysql
  listarUsuarios(): void {
    this.service.listar().subscribe({
      // Si todo esta OK
      next: (respuesta) => {
        this.usuarios = respuesta;
        console.log('Usuarios Recibidos', respuesta);
        
        // REQUERIDO: Forzar a Angular a procesar el render de la tabla inmediatamente
        this.cdr.detectChanges(); 
      },
      // Si hay algun error
      error: (error) => {
        console.error('Error al consultar usuarios:', error);
        alert('No se pueden cargar los usuarios');
      }
    });
  }

  // Seleccionar un usuario para editar sus datos
  seleccionarUsuario(usuario: Usuario): void {
    this.formulario = {
      idUsuario:usuario.idUsuario,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      passworduser: '',
      rol: usuario.rol
    };

    this.modoedicion = true;
    this.cdr.detectChanges();
  }

  // filtrar a los usuarios por dni o nombre
  get usuariosFiltrados(): Usuario[] {
    const texto = this.busqueda.toLowerCase().trim();
    return this.usuarios.filter(usuario =>
      usuario.idUsuario.toLowerCase().includes(texto) ||
      usuario.nombres.toLowerCase().includes(texto) ||
      usuario.apellidos.toLowerCase().includes(texto)
    );
  }

  // Limpiar campos
  limpiar(): void {
    this.formulario = {
      idUsuario: '',
      nombres: '',
      apellidos: '',
      passworduser: '',
      rol: 'ADMINISTRADOR'
    };
    this.modoedicion = false;
    this.cdr.detectChanges();
  }

  guardar(): void {
    if (
      !this.formulario.idUsuario ||
      !this.formulario.nombres ||
      !this.formulario.apellidos ||
      !this.formulario.passworduser
    ) {
      alert('Complete todos los campos del formulario.');
      return;
    }

    const datos: UsuarioFormulario = { ...this.formulario };

    this.service.registrar(datos).subscribe({
      next: (respuesta) => {
        alert('Usuario registrado correctamente.');
        this.listarUsuarios();
        this.limpiar();
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        if (error.status === 400) {
          alert('El IDya está registrado.');
        } else {
          alert('No se pudo registrar el usuario.');
        }
      }
    });
  }

  actualizar(): void {
    if (!this.formulario.nombres || !this.formulario.apellidos) {
      alert('Complete los campos del formulario.');
      return;
    }
    const datos: UsuarioFormulario = { ...this.formulario };

    this.service.actualizar(this.formulario.idUsuario, datos).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente.');
        this.listarUsuarios();
        this.limpiar();
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        alert('No se pudo actualizar el usuario.');
      }
    });





}

 eliminarUsuario(usuario: Usuario): void {

    if (confirm('¿Está seguro de eliminar este usuario?')) {

      this.service.eliminar(usuario.idUsuario).subscribe({

        next: () => {
          alert('Usuario eliminado correctamente.');
          this.listarUsuarios();
          this.limpiar();
        },

        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('No se pudo eliminar el usuario.');
        }

      });

    }
  }



}
