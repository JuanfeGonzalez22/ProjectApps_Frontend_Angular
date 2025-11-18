// src/app/admin/pages/dashboard/sections/gestion-evaluaciones/editar-evaluacion/editar-evaluacion.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { EvaluationData } from '../../../../../../core/models/evaluation.model';
import { ModuleData } from '../../../../../../core/models/module.model';

@Component({
  selector: 'app-editar-evaluacion',
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
  templateUrl: './editar-evaluacion.html',
  styleUrls: ['./editar-evaluacion.scss']
})
export class EditarEvaluacionComponent implements OnInit {
  @Input() evaluacion: EvaluationData | null = null;
  @Output() evaluacionActualizada = new EventEmitter<EvaluationData>();
  @Output() cancelar = new EventEmitter<void>();

  modulos: ModuleData[] = [];
  tiposEvaluacion: string[] = ['quiz', 'MCQ', 'Abierto', 'examen'];

  evaluacionLocal: EvaluationData = {
    id: 0,
    moduleId: 0,
    title: '',
    type: '',
    maxScore: 100,
    description: '',
    dueDate: ''
  };

  cargando: boolean = false;

  constructor(
    private evaluationService: EvaluationService,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.cargarModulos();

    if (this.evaluacion) {
      this.evaluacionLocal = { ...this.evaluacion };
      console.log('📝 Editando evaluación:', this.evaluacionLocal);
    }
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
    if (!this.evaluacionLocal.title || this.evaluacionLocal.title.trim() === '') {
      alert('El título es obligatorio');
      return;
    }

    if (!this.evaluacionLocal.moduleId || this.evaluacionLocal.moduleId === 0) {
      alert('Debes seleccionar un módulo');
      return;
    }

    if (!this.evaluacionLocal.type) {
      alert('Debes seleccionar un tipo de evaluación');
      return;
    }

    if (!this.evaluacionLocal.maxScore || this.evaluacionLocal.maxScore <= 0) {
      alert('La puntuación máxima debe ser mayor a 0');
      return;
    }

    if (!this.evaluacionLocal.id) {
      alert('Error: No se puede actualizar sin ID');
      return;
    }

    this.cargando = true;

    console.log('📤 Actualizando evaluación:', this.evaluacionLocal);

    this.evaluationService.update(this.evaluacionLocal.id, this.evaluacionLocal).subscribe({
      next: (evaluacionActualizada: EvaluationData) => {
        console.log('✅ Evaluación actualizada:', evaluacionActualizada);
        alert('Evaluación actualizada exitosamente');
        this.evaluacionActualizada.emit(evaluacionActualizada);
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('❌ Error actualizando evaluación:', err);
        alert('Error al actualizar la evaluación. Revisa los datos e intenta nuevamente.');
        this.cargando = false;
      }
    });
  }

  onCancelar(): void {
    if (confirm('¿Seguro que deseas cancelar? Se perderán los cambios realizados.')) {
      this.cancelar.emit();
    }
  }
}