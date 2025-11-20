// src/app/student/pages/detail-curse-student/course-detail.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseService } from '../../../core/services/course.service';
import { ModuleService } from '../../../core/services/module.service';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { ProgressHistoryService } from '../../../core/services/progress-history.service';
import { CourseData } from '../../../core/models/course.model';
import { ModuleData } from '../../../core/models/module.model';
import { EvaluationData } from '../../../core/models/evaluation.model';
import { ProgressHistory } from '../../../core/models/progress-history.model';
import { EvaluationDialogComponent } from '../evaluation-dialog/evaluation-dialog.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.scss']
})
export class CourseDetail implements OnInit {
  @Input() courseId!: number;
  @Input() registrationId!: number; // IMPORTANTE: Necesitas pasar esto desde el componente padre
  @Output() volver = new EventEmitter<void>();

  curso: CourseData | null = null;
  modulos: ModuleData[] = [];
  evaluaciones: EvaluationData[] = [];
  loading = true;
  error = '';

  // Tracking de progreso
  modulosCompletados = new Set<number>();
  progressHistory: ProgressHistory[] = [];
  currentProgress: ProgressHistory | null = null;
  moduleStartTime: number = 0;

  // Datos de ejemplo para material
  materiales = [
    { tipo: 'video', titulo: 'Video: Introducción al curso', icono: 'play_circle', clase: 'video' },
    { tipo: 'pdf', titulo: 'PDF: Guía de estudio', icono: 'picture_as_pdf', clase: 'pdf' },
    { tipo: 'pdf', titulo: 'PDF: Información del tema', icono: 'picture_as_pdf', clase: 'pdf' },
    { tipo: 'link', titulo: 'Link: Página externa', icono: 'link', clase: 'link' }
  ];

  constructor(
    private courseService: CourseService,
    private moduleService: ModuleService,
    private evaluationService: EvaluationService,
    private progressService: ProgressHistoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarDetalleCurso();
    this.iniciarSeguimientoTiempo();
  }

  iniciarSeguimientoTiempo() {
    this.moduleStartTime = Date.now();
  }

  cargarDetalleCurso() {
    this.loading = true;

    // Cargar datos del curso
    this.courseService.getById(this.courseId).subscribe({
      next: (curso) => {
        this.curso = curso;
        console.log('Curso cargado:', curso);
        this.cargarModulos();
      },
      error: (err) => {
        console.error('Error cargando curso:', err);
        this.error = 'No se pudo cargar el curso';
        this.loading = false;
      }
    });
  }

  cargarModulos() {
    this.moduleService.getAll().subscribe({
      next: (modulos) => {
        this.modulos = modulos
          .filter(m => m.courseId === this.courseId)
          .sort((a, b) => a.orden - b.orden);
        console.log('Módulos cargados:', this.modulos);

        // Cargar estado de progreso de cada módulo
        this.cargarEstadoProgreso();
        this.cargarEvaluaciones();
      },
      error: (err) => {
        console.error('Error cargando módulos:', err);
        this.loading = false;
      }
    });
  }

  cargarEstadoProgreso() {
    if (!this.registrationId) {
      console.warn('⚠️ No hay registrationId, no se puede cargar progreso');
      return;
    }

    // Cargar progreso actual
    this.progressService.getCurrentProgress(this.registrationId).subscribe({
      next: (progress) => {
        this.currentProgress = progress;
        console.log('📊 Progreso actual:', progress);
      },
      error: (err) => {
        console.log('ℹ️ No hay progreso previo registrado');
      }
    });

    // Verificar qué módulos están completados
    this.modulos.forEach(modulo => {
      if (modulo.id) {
        this.progressService.isModuleCompleted(this.registrationId, modulo.id).subscribe({
          next: (isCompleted) => {
            if (isCompleted && modulo.id) {
              this.modulosCompletados.add(modulo.id);
            }
          },
          error: (err) => {
            console.error('Error verificando módulo:', err);
          }
        });
      }
    });
  }

  cargarEvaluaciones() {
    const evaluacionesPromises = this.modulos.map(modulo =>
      this.evaluationService.getByModuleId(modulo.id!).toPromise()
    );

    Promise.all(evaluacionesPromises).then(results => {
      this.evaluaciones = results
        .filter(result => result !== undefined)
        .flat() as EvaluationData[];

      console.log('Evaluaciones cargadas:', this.evaluaciones);
      this.loading = false;
    }).catch(err => {
      console.error('Error cargando evaluaciones:', err);
      this.loading = false;
    });
  }

  /**
   * NUEVA FUNCIONALIDAD: Marcar módulo como completado
   */
  marcarModuloCompletado(modulo: ModuleData) {
    if (!modulo.id || !this.registrationId) {
      this.snackBar.open('❌ Error: Datos incompletos', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.isModuloCompletado(modulo.id)) {
      this.snackBar.open('ℹ️ Este módulo ya está completado', 'Cerrar', { duration: 3000 });
      return;
    }

    // Calcular tiempo dedicado
    const timeDedicated = this.progressService.calculateTimeDedicated(this.moduleStartTime);

    console.log('⏱️ Marcando módulo completado:', {
      moduleId: modulo.id,
      registrationId: this.registrationId,
      timeDedicated
    });

    this.progressService.markModuleAsCompleted(
      modulo.id,
      this.registrationId,
      timeDedicated
    ).subscribe({
      next: (progress) => {
        console.log('✅ Módulo completado exitosamente:', progress);

        // Actualizar estado local
        if (modulo.id) {
          this.modulosCompletados.add(modulo.id);
        }
        this.currentProgress = progress;

        // Reiniciar contador de tiempo
        this.iniciarSeguimientoTiempo();

        // Mostrar notificación
        this.snackBar.open(
          `🎉 ¡Módulo completado! Progreso: ${progress.moduleProgress.toFixed(0)}%`,
          'Cerrar',
          { duration: 5000 }
        );

        // Recargar progreso
        this.cargarEstadoProgreso();
      },
      error: (err) => {
        console.error('❌ Error al marcar módulo completado:', err);
        this.snackBar.open(
          '❌ Error al guardar progreso. Intenta nuevamente.',
          'Cerrar',
          { duration: 4000 }
        );
      }
    });
  }

  /**
   * Verifica si un módulo está completado
   */
  isModuloCompletado(moduleId: number): boolean {
    return this.modulosCompletados.has(moduleId);
  }

  /**
   * Obtiene el porcentaje de progreso general del curso
   */
  getProgresoTotal(): number {
    if (this.modulos.length === 0) return 0;
    const completados = this.modulosCompletados.size;
    return Math.round((completados / this.modulos.length) * 100);
  }

  /**
   * Obtiene el número de módulos completados
   */
  getModulosCompletadosCount(): number {
    return this.modulosCompletados.size;
  }

  getTipoIcono(tipo?: string): string {
    const iconos: { [key: string]: string } = {
      'video': 'play_circle_outline',
      'texto': 'description',
      'quiz': 'quiz',
      'practica': 'code'
    };
    return iconos[tipo || ''] || 'book';
  }

  getTipoClase(tipo?: string): string {
    return tipo || 'default';
  }

  volverALista() {
    this.volver.emit();
  }

  verProgreso() {
    console.log('📊 Ver progreso detallado del curso:', this.courseId);

    if (this.registrationId) {
      this.progressService.getProgressHistory(this.registrationId).subscribe({
        next: (history) => {
          console.log('📜 Historial de progreso:', history);
          this.progressHistory = history;
          // Aquí podrías abrir un diálogo con el historial completo
        },
        error: (err) => {
          console.error('Error obteniendo historial:', err);
        }
      });
    }
  }

  descargarMaterial(material: any) {
    console.log('📥 Descargar material:', material);
    // Implementar lógica de descarga
  }

  verLink(material: any) {
    console.log('🔗 Abrir link:', material);
    // Implementar lógica de navegación
  }

  realizarQuiz(evaluation: EvaluationData) {
    console.log('📝 Realizar evaluación:', evaluation);

    const dialogRef = this.dialog.open(EvaluationDialogComponent, {
      width: '800px',
      data: { evaluation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('✅ Evaluación enviada:', result);
        this.cargarEvaluaciones();
      }
    });
  }

  verResultado(evaluation: EvaluationData) {
    console.log('👁️ Ver resultado:', evaluation);

    this.dialog.open(EvaluationDialogComponent, {
      width: '800px',
      data: { evaluation, viewMode: true }
    });
  }

  getEstadoEvaluacion(evaluation: EvaluationData): string {
    return 'Pendiente';
  }

  isEvaluacionCompletada(evaluation: EvaluationData): boolean {
    return this.getEstadoEvaluacion(evaluation) === 'Completado';
  }

  getNivelTexto(level: number): string {
    const niveles: { [key: number]: string } = {
      1: 'Básico',
      2: 'Intermedio',
      3: 'Avanzado'
    };
    return niveles[level] || 'Nivel ' + level;
  }

  getModuleName(moduleId: number): string {
    const modulo = this.modulos.find(m => m.id === moduleId);
    return modulo ? modulo.title : 'Módulo ' + moduleId;
  }
}
