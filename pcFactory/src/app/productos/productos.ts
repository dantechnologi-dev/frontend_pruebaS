
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})

export class ProductosComponent implements OnInit {

  // URL DEL BACKEND
  private urlProductos = 'http://localhost:8080/api/productos';
  private urlCategorias = 'http://localhost:8080/api/categorias';
  private urlProveedores = 'http://localhost:8080/api/proveedores';

  // OBJETO PRODUCTO
  producto = {
    nombre_producto: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    id_categoria: null as number | null,
    id_proveedor: null as number | null,
    imagen_url: ''
  };

  // LISTAS
  categorias: any[] = [];
  proveedores: any[] = [];

  constructor(private http: HttpClient) {}

  // INICIALIZAR COMPONENTE
  ngOnInit(): void {
    this.listarCategorias();
    this.listarProveedores();
  }

  // LISTAR CATEGORÍAS
  listarCategorias(): void {
    this.http.get<any[]>(this.urlCategorias).subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  // LISTAR PROVEEDORES
  listarProveedores(): void {
    this.http.get<any[]>(this.urlProveedores).subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
      }
    });
  }

  // GUARDAR PRODUCTO
  guardarProducto(): void {

    this.http.post(this.urlProductos, this.producto).subscribe({

      next: (respuesta) => {
        alert('¡Producto registrado correctamente!');

        console.log('Producto registrado:', respuesta);

        this.limpiarFormulario();
      },

      error: (error) => {
        console.error('Error al registrar producto:', error);

        alert('No se pudo registrar el producto.');
      }

    });

  }

  // LIMPIAR FORMULARIO
  limpiarFormulario(): void {
    this.producto = {
      nombre_producto: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      id_categoria: null,
      id_proveedor: null,
      imagen_url: ''
    };
  }

  // CANCELAR
  cancelar(): void {
    this.limpiarFormulario();
  }

}
