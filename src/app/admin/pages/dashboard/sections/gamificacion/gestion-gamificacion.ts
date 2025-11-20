// src/app/admin/pages/dashboard/sections/gamificacion/gestion-gamificacion.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../../../../core/services/rating.service';
import { RatingResponse } from '../../../../../core/models/rating.model';
import { AgregarGamificacionComponent } from './agregar-gamificacion/agregar-gamificacion';
import { EditarGamificacionComponent } from './editar-gamificacion/editar-gamificacion';

@Component({
  selector: 'app-gestion-gamificacion',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    AgregarGamificacionComponent,
    EditarGamificacionComponent
  ],
  templateUrl: './gestion-gamificacion.html',
  styleUrls: ['./gestion-gamificacion.scss']
})
export class GestionGamificacion implements OnInit {
  datos: RatingResponse[] = [];
  datosFiltrados: RatingResponse[] = [];
  vista: 'tabla' | 'agregar' | 'editar' = 'tabla';
  elementoSeleccionado: RatingResponse | null = null;
  searchTerm: string = '';

  opcionesIconos = [
    { value: '🏆', label: 'Trofeo' },
    { value: '🥇', label: 'Medalla Oro' },
    { value: '🥈', label: 'Medalla Plata' },
    { value: '🥉', label: 'Medalla Bronce' },
    { value: '⭐', label: 'Estrella' },
    { value: '👑', label: 'Corona' },
    { value: '💎', label: 'Diamante' },
    { value: '🚀', label: 'Cohete' },
    { value: '🎯', label: 'Diana' },
    { value: '📚', label: 'Libros' },
    { value: '🧠', label: 'Cerebro' },
    { value: '⚡', label: 'Rayo' }
  ];

  constructor(private ratingService: RatingService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  // ✅ MÉTODO DE PRUEBA PARA DIAGNÓSTICO
  probarBackend() {
    console.log('🚀 Iniciando prueba de backend...');
    
    // Verificar token primero
    const token = localStorage.getItem('token');
    console.log('🔐 Token en localStorage:', token ? 'EXISTE' : 'NO EXISTE');
    
    if (token) {
      console.log('📋 Token (primeros 50 chars):', token.substring(0, 50) + '...');
    }

    // Llamar al método de prueba del servicio
    this.ratingService.testBackendConnection().subscribe({
      next: (response) => {
        console.log('✅ BACKEND FUNCIONA:', response);
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Body:', response.body);
        
        // Si funciona, recargar datos
        this.cargarDatos();
      },
      error: (error) => {
        console.error('❌ ERROR BACKEND:', error);
        console.log('Status:', error.status);
        console.log('Status Text:', error.statusText);
        console.log('URL:', error.url);
        console.log('Error completo:', error);
        
        if (error.status === 0) {
          console.log('🔌 Problema de conexión - Backend no responde');
          console.log('💡 Verifica que Spring Boot esté corriendo en puerto 8089');
        } else if (error.status === 500) {
          console.log('🐛 Error interno del servidor - Revisar logs del backend');
          console.log('💡 Revisa los logs de Spring Boot para ver el error específico');
        } else if (error.status === 401) {
          console.log('🔐 No autorizado - Problema con JWT token');
          console.log('💡 Verifica que el token sea válido y no haya expirado');
        } else if (error.status === 403) {
          console.log('🚫 Prohibido - Sin permisos de ADMIN');
          console.log('💡 Verifica que el usuario tenga rol ADMIN');
        } else if (error.status === 404) {
          console.log('🔍 Endpoint no encontrado');
          console.log('💡 Verifica que la URL del endpoint sea correcta');
        }
      },
      complete: () => {
        console.log('🏁 Prueba completada');
      }
    });
  }

  cargarDatos() {
    this.ratingService.getAll().subscribe({
      next: (data) => {
        this.datos = data;
        this.datosFiltrados = [...data];
        console.log('✅ Datos cargados correctamente:', data.length, 'elementos');
      },
      error: (error) => {
        console.error('Error cargando gamificaciones:', error);
        this.datos = [];
        this.datosFiltrados = [];
      }
    });
  }

  filtrar() {
    if (!this.searchTerm) {
      this.datosFiltrados = [...this.datos];
    } else {
      this.datosFiltrados = this.datos.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.criterion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  seleccionar(elemento: RatingResponse) {
    this.elementoSeleccionado = elemento;
  }

  eliminar() {
    if (!this.elementoSeleccionado) {
      alert('Seleccione un elemento para eliminar');
      return;
    }

    if (confirm(`¿Está seguro de eliminar "${this.elementoSeleccionado.name}"?`)) {
      this.ratingService.delete(this.elementoSeleccionado.id).subscribe({
        next: () => {
          this.cargarDatos();
          this.elementoSeleccionado = null;
        },
        error: (error) => {
          console.error('Error eliminando:', error);
          alert('Error al eliminar. Verifique el servidor.');
        }
      });
    }
  }

  editar() {
    if (!this.elementoSeleccionado) {
      alert('Seleccione un elemento para editar');
      return;
    }
    this.vista = 'editar';
  }

  nuevo() {
    this.vista = 'agregar';
  }

  volverATabla() {
    this.vista = 'tabla';
    this.elementoSeleccionado = null;
  }

  onElementoCreado(nuevoElemento: RatingResponse) {
    this.cargarDatos();
    this.volverATabla();
  }

  onElementoActualizado(elementoActualizado: RatingResponse) {
    this.cargarDatos();
    this.volverATabla();
  }
}