import { Component } from '@angular/core';


//Importa router para poder navegar entre las paginas
import {Router} from '@angular/router';


//Importa el uso del forms module
import {FormsModule} from '@angular/forms';


//Importa HttpClient para poder realizar peticios HTTP
import {HttpClient} from '@angular/common/http';


@Component({
  
  selector: 'app-login',
  standalone:true,
   //importar el FormsModule para poder utilizar [(ngModel)]
  imports:[FormsModule],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class LoginComponent {

idUsuario:string = '' ;
  passwordUser:string='';


  constructor(
    private router: Router,
    private http:HttpClient
  ){
  }


  ingresar():void{
    const datoslogin={
      idUsuario:this.idUsuario,
      passwordUser:this.passwordUser
    };
    const jsonlogin=JSON.stringify(datoslogin);
    console.log('Objeto:',datoslogin);
    console.log('JSON:',jsonlogin);

 //enviar datos al backend mediante una peticion POST
    this.http.post('http://localhost:8080/api/auth/login', datoslogin).subscribe({
      //Esto se va a ejecutar cuando el servidor responde bien

      next: (respuesta:any) => {
        //Mostramos la respuesta al servidor
        console.log('Respuesta del Servidor',respuesta);
      // Guardamos los datos de la respuesta en el localStorage
        localStorage.setItem('user_id', respuesta.idusuario);
        
        //Si las credenciales son correctas,navegamos a la pantalla principal
        this.router.navigate(['/principal']);
      },

      //si falla se ejecuta esto
      error: (error) => {

        // Mostramos el error en la consola
        console.error('Error al conectar con el servidor', error);
      }
    });


  };
}















