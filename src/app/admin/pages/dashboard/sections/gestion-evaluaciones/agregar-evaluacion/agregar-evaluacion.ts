// src/app/admin/pages/dashboard/sections/gestion-evaluaciones/agregar-evaluacion/agregar-evaluacion.ts

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { EvaluationService } from '../../../../../../core/services/evaluation.service';
import { ModuleService } from '../../../../../../core/services/module.service';
import { EvaluationData, EvaluationDTO } from '../../../../../../core/models/evaluation.model';
import { ModuleData } from '../../../../../../core/models/module.model';

@Component({
  selector: 'app-agregar-evaluacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './agregar-evaluacion.html',
  styleUrls: ['./agregar-evaluacion.scss']
})
export class AgregarEvaluacionComponent implements OnInit {
  @Output() evaluacionCreada = new EventEmitter<EvaluationData>();
  @Output() cancelar = new EventEmitter<void>();

  modulos: ModuleData[] = [];
  tiposEvaluacion: string[] = ['quiz', 'MCQ', 'Abierto', 'examen'];

  // Modelo para el formulario
  evaluacion: EvaluationDTO = {
    moduleId: 0,
    title: '',
    type: '',
    maxScore: 100
  };

  descripcion: string = '';
  dueDate: string = '';
  cargando: boolean = false;

  constructor(
    private evaluationService: EvaluationService,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.cargarModulos();
  }

  cargarModulos(): void {
    this.moduleService.getAll().subscribe({
      next: (data: ModuleData[]) => {
        this.modulos = data;
        console.log('✅ Módulos cargados:', data);
      },
      error: (err: any) => {
        console.error('❌ Error cargando módulos:', err);
        alert('Error al cargar los módulos disponibles.');
      }
    });
  }

  onSubmit(): void {
    // Validaciones
    if (!this.evaluacion.title || this.evaluacion.title.trim() === '') {
      alert('El título es obligatorio');
      return;
    }

    if (!this.evaluacion.moduleId || this.evaluacion.moduleId === 0) {
      alert('Debes seleccionar un módulo');
      return;
    }

    if (!this.evaluacion.type) {
      alert('Debes seleccionar un tipo de evaluación');
      return;
    }

    if (!this.evaluacion.maxScore || this.evaluacion.maxScore <= 0) {
      alert('La puntuación máxima debe ser mayor a 0');
      return;
    }

    this.cargando = true;

    // Crear el objeto completo con campos opcionales
    const evaluacionCompleta: any = {
      ...this.evaluacion
    };

    if (this.descripcion && this.descripcion.trim() !== '') {
      evaluacionCompleta.description = this.descripcion.trim();
    }

    if (this.dueDate && this.dueDate.trim() !== '') {
      evaluacionCompleta.dueDate = this.dueDate.trim();
    }

    console.log('📤 Enviando evaluación:', evaluacionCompleta);

    this.evaluationService.create(evaluacionCompleta).subscribe({
      next: (nuevaEvaluacion: EvaluationData) => {
        console.log('✅ Evaluación creada:', nuevaEvaluacion);
        alert('Evaluación creada exitosamente');
        this.evaluacionCreada.emit(nuevaEvaluacion);
        this.resetForm();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('❌ Error creando evaluación:', err);
        alert('Error al crear la evaluación. Revisa los datos e intenta nuevamente.');
        this.cargando = false;
      }
    });
  }

  onCancelar(): void {
    if (confirm('¿Seguro que deseas cancelar? Se perderán los datos ingresados.')) {
      this.resetForm();
      this.cancelar.emit();
    }
  }

  resetForm(): void {
    this.evaluacion = {
      moduleId: 0,
      title: '',
      type: '',
      maxScore: 100
    };
    this.descripcion = '';
    this.dueDate = '';
  }
}
