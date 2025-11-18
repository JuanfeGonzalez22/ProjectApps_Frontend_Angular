// src/app/admin/pages/dashboard/sections/gestion-evaluaciones/gestion-evaluaciones.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EvaluationService } from '../../../../../core/services/evaluation.service';
import { ModuleService } from '../../../../../core/services/module.service';
import { EvaluationData } from '../../../../../core/models/evaluation.model';
import { ModuleData } from '../../../../../core/models/module.model';
import { AgregarEvaluacionComponent } from './agregar-evaluacion/agregar-evaluacion';
import { EditarEvaluacionComponent } from './editar-evaluacion/editar-evaluacion';

@Component({
  selector: 'app-gestion-evaluaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    AgregarEvaluacionComponent,
    EditarEvaluacionComponent
  ],
  templateUrl: './gestion-evaluaciones.html',
  styleUrls: ['./gestion-evaluaciones.scss']
})
export class GestionEvaluaciones implements OnInit {
  evaluaciones: EvaluationData[] = [];
  evaluacionesFiltradas: EvaluationData[] = [];
  modulos: ModuleData[] = [];
  searchTerm: string = '';
  evaluacionSeleccionada: EvaluationData | null = null;
  vista: 'lista' | 'crear' | 'editar' = 'lista';

  constructor(
    private evaluationService: EvaluationService,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.cargarModulos();
    this.cargarEvaluaciones();
  }

  cargarModulos(): void {
    this.moduleService.getAll().subscribe({
      next: (data) => {
        this.modulos = data;
        console.log('✅ Módulos cargados:', data);
      },
      error: (err) => {
        console.error('❌ Error cargando módulos:', err);
      }
    });
  }

  cargarEvaluaciones(): void {
    console.log('📡 Cargando evaluaciones...');
    this.evaluationService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Evaluaciones recibidas:', data);
        console.log('📊 Total de evaluaciones:', data.length);

        // Verificar que todas tengan ID
        data.forEach((evaluacion, index) => {
          if (!evaluacion.id) {
            console.warn(`⚠️ Evaluación ${index} sin ID:`, evaluacion);
          } else {
            console.log(`✅ Evaluación ${index} - ID: ${evaluacion.id}, Título: ${evaluacion.title}`);
          }
        });

        this.evaluaciones = data;
        this.evaluacionesFiltradas = [...data];
      },
      error: (err) => {
        console.error('❌ Error cargando evaluaciones:', err);
        this.evaluaciones = [];
        this.evaluacionesFiltradas = [];
      }
    });
  }

  filtrarEvaluaciones(): void {
    const termino = this.searchTerm.toLowerCase().trim();

    if (!termino) {
      this.evaluacionesFiltradas = [...this.evaluaciones];
      return;
    }

    this.evaluacionesFiltradas = this.evaluaciones.filter(evaluacion =>
      evaluacion.title?.toLowerCase().includes(termino) ||
      evaluacion.type?.toLowerCase().includes(termino) ||
      evaluacion.id?.toString().includes(termino) ||
      evaluacion.moduleId?.toString().includes(termino)
    );

    console.log(`Búsqueda: "${termino}" - Resultados: ${this.evaluacionesFiltradas.length}`);
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.evaluacionesFiltradas = [...this.evaluaciones];
  }

  crearEvaluacion(): void {
    this.vista = 'crear';
  }

  editarEvaluacion(): void {
    console.log('🔍 Verificando evaluación seleccionada:', this.evaluacionSeleccionada);

    if (!this.evaluacionSeleccionada) {
      alert('Primero selecciona una evaluación de la tabla.');
      return;
    }

    if (!this.evaluacionSeleccionada.id) {
      console.error('❌ La evaluación no tiene ID');
      console.error('Objeto completo:', JSON.stringify(this.evaluacionSeleccionada, null, 2));
      alert('Error: La evaluación seleccionada no tiene un ID válido.');
      return;
    }

    console.log('✅ Abriendo formulario de edición para ID:', this.evaluacionSeleccionada.id);
    this.vista = 'editar';
  }

  eliminarEvaluacion(): void {
    if (!this.evaluacionSeleccionada) {
      alert('Primero selecciona una evaluación de la tabla.');
      return;
    }

    if (!this.evaluacionSeleccionada.id) {
      console.error('❌ La evaluación seleccionada no tiene ID:', this.evaluacionSeleccionada);
      alert('Error: La evaluación seleccionada no tiene un ID válido.');
      return;
    }

    const confirmado = confirm(
      `¿Seguro que quieres eliminar la evaluación "${this.evaluacionSeleccionada.title}" (ID: ${this.evaluacionSeleccionada.id})?`
    );

    if (!confirmado) return;

    const id = this.evaluacionSeleccionada.id;

    console.log('🗑️ Intentando eliminar evaluación con ID:', id);

    this.evaluationService.delete(id).subscribe({
      next: () => {
        console.log('✅ Evaluación eliminada:', id);
        this.evaluaciones = this.evaluaciones.filter(e => e.id !== id);
        this.evaluacionesFiltradas = this.evaluacionesFiltradas.filter(e => e.id !== id);
        this.evaluacionSeleccionada = null;
        alert('Evaluación eliminada correctamente.');
      },
      error: (err: any) => {
        console.error('❌ Error eliminando evaluación:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        console.error('Error completo:', err);

        if (err.status === 403) {
          alert('Error 403: No tienes permisos para eliminar evaluaciones. Verifica que seas ADMIN.');
        } else if (err.status === 401) {
          alert('Error 401: Tu sesión expiró. Por favor inicia sesión nuevamente.');
        } else {
          alert(`Error al eliminar la evaluación: ${err.message || 'Error desconocido'}`);
        }
      }
    });
  }

  seleccionarEvaluacion(evaluacion: EvaluationData): void {
    this.evaluacionSeleccionada = { ...evaluacion };
    console.log('✅ Evaluación seleccionada:', this.evaluacionSeleccionada);
    console.log('📋 ID de la evaluación:', this.evaluacionSeleccionada.id);
    console.log('📋 Datos completos:', JSON.stringify(this.evaluacionSeleccionada, null, 2));
  }

  onEvaluacionCreada(nuevaEvaluacion: EvaluationData): void {
    this.evaluaciones = [...this.evaluaciones, nuevaEvaluacion];
    this.evaluacionesFiltradas = [...this.evaluaciones];
    this.vista = 'lista';
    this.evaluacionSeleccionada = null;
  }

  onEvaluacionActualizada(evaluacionActualizada: EvaluationData): void {
    this.evaluaciones = this.evaluaciones.map(e =>
      e.id === evaluacionActualizada.id ? evaluacionActualizada : e
    );
    this.evaluacionesFiltradas = [...this.evaluaciones];
    this.vista = 'lista';
    this.evaluacionSeleccionada = null;
  }

  volverALista(): void {
    this.vista = 'lista';
    this.evaluacionSeleccionada = null;
  }

  getModuleName(moduleId: number): string {
    const modulo = this.modulos.find(m => m.id === moduleId);
    return modulo ? modulo.title : `Módulo ${moduleId}`;
  }

  getTipoClase(tipo: string): string {
    const clases: { [key: string]: string } = {
      'quiz': 'tipo-quiz',
      'MCQ': 'tipo-mcq',
      'Abierto': 'tipo-abierto',
      'examen': 'tipo-examen'
    };
    return clases[tipo] || 'tipo-default';
  }
}
