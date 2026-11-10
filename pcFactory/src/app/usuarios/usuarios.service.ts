//Para usar los componentes de Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

//Estructura de datos que va a devolver Spring
export interface Usuario {
    idUsuario: string;
    nombres: string;
    apellidos: string;
    rol: string;
}

// Datos necesarios para registrar y actualizar usuarios
export interface UsuarioFormulario {
    idUsuario: string;
    nombres: string;
    apellidos: string;
    passworduser: string;
    rol: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {

    //Direccion de tu Spring Boot
    private apiUrl = "http://localhost:8080/api/usuarios";

    //Solicitudes HTTP
    constructor(private http: HttpClient) { }

    // R - Realizar la consulta hacia MySQL
    listar(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    // C - Registrar usuario
    registrar(usuario: UsuarioFormulario): Observable<Usuario> {
        return this.http.post<Usuario>(this.apiUrl, usuario);
    }

    // U - Actualizar usuario
    actualizar(idUsuario: string, usuario: UsuarioFormulario): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${idUsuario}`, usuario);
    }

    // D - Eliminar usuario
    eliminar(idUsuario: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${idUsuario}`, {
            responseType: 'text'
        });
    }
}