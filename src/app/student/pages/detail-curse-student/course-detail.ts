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
import { MatTooltipModule } from '@angular/material/tooltip';
import { CourseService } from '../../../core/services/course.service';
import { ModuleService } from '../../../core/services/module.service';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { ProgressHistoryService } from '../../../core/services/progress-history.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { AuthService } from '../../../auth/services/auth';
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
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.scss']
})
export class CourseDetail implements OnInit {
  @Input() courseId!: number;
  @Output() volver = new EventEmitter<void>();

  curso: CourseData | null = null;
  modulos: ModuleData[] = [];
  evaluaciones: EvaluationData[] = [];
  loading = true;
  error = '';

  // NUEVO: Variables de progreso
  registrationId: number | null = null;
  userId: number | null = null;
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
    private registrationService: RegistrationService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Obtener usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;
    }

    this.iniciarSeguimientoTiempo();
    this.cargarDetalleCurso();
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
        console.log('📚 Curso cargado:', curso);

        // NUEVO: Obtener el registrationId
        this.obtenerRegistration();
      },
      error: (err) => {
        console.error('❌ Error cargando curso:', err);
        this.error = 'No se pudo cargar el curso';
        this.loading = false;
      }
    });
  }

  /**
   * NUEVO: Obtiene el registration del usuario para este curso
   */
  obtenerRegistration() {
    if (!this.userId) {
      console.error('❌ No hay userId disponible');
      this.cargarModulos(); // Continuar sin progreso
      return;
    }

    console.log('🔍 Buscando registration para userId:', this.userId, 'courseId:', this.courseId);

    // Obtener todas las registrations y filtrar por usuario y curso
    this.registrationService.getAll().subscribe({
      next: (registrations) => {
        console.log('📋 Registrations encontradas:', registrations);

        const registration = registrations.find(
          r => r.userId === this.userId && r.courseId === this.courseId
        );

        if (registration && registration.id) {
          this.registrationId = registration.id;
          console.log('✅ Registration encontrada:', registration);
          console.log('🎯 Registration ID:', this.registrationId);
        } else {
          console.warn('⚠️ No se encontró registration para este usuario y curso');
          console.log('💡 Creando registration automáticamente...');
          this.crearRegistration();
          return;
        }

        this.cargarModulos();
      },
      error: (err) => {
        console.error('❌ Error obteniendo registrations:', err);
        this.cargarModulos(); // Continuar sin progreso
      }
    });
  }

  /**
   * NUEVO: Crea una registration si no existe
   */
  crearRegistration() {
    if (!this.userId) return;

    const newRegistration = {
      userId: this.userId,
      courseId: this.courseId,
      status: 'ACTIVO'
    };

    this.registrationService.create(newRegistration).subscribe({
      next: (registration) => {
        console.log('✅ Registration creada:', registration);
        this.registrationId = registration.id;
        this.cargarModulos();
      },
      error: (err) => {
        console.error('❌ Error creando registration:', err);
        this.cargarModulos();
      }
    });
  }

  cargarModulos() {
    this.moduleService.getAll().subscribe({
      next: (modulos) => {
        this.modulos = modulos
          .filter(m => m.courseId === this.courseId)
          .sort((a, b) => a.orden - b.orden);
        console.log('📦 Módulos cargados:', this.modulos);

        // NUEVO: Cargar estado de progreso
        if (this.registrationId) {
          this.cargarEstadoProgreso();
        }

        this.cargarEvaluaciones();
      },
      error: (err) => {
        console.error('❌ Error cargando módulos:', err);
        this.loading = false;
      }
    });
  }

  /**
   * NUEVO: Carga el estado de progreso de todos los módulos
   */
  cargarEstadoProgreso() {
    if (!this.registrationId) {
      console.warn('⚠️ No hay registrationId, no se puede cargar progreso');
      return;
    }

    console.log('📊 Cargando estado de progreso para registrationId:', this.registrationId);

    // Cargar progreso actual
    this.progressService.getCurrentProgress(this.registrationId).subscribe({
      next: (progress) => {
        this.currentProgress = progress;
        console.log('✅ Progreso actual:', progress);
      },
      error: (err) => {
        console.log('ℹ️ No hay progreso previo registrado');
      }
    });

    // Verificar qué módulos están completados
    this.modulos.forEach(modulo => {
      if (modulo.id) {
        this.progressService.isModuleCompleted(this.registrationId!, modulo.id).subscribe({
          next: (isCompleted) => {
            if (isCompleted && modulo.id) {
              this.modulosCompletados.add(modulo.id);
              console.log(`✅ Módulo ${modulo.id} completado`);
            }
          },
          error: (err) => {
            // Es normal que algunos módulos no estén completados
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

      console.log('📝 Evaluaciones cargadas:', this.evaluaciones);
      this.loading = false;
    }).catch(err => {
      console.error('❌ Error cargando evaluaciones:', err);
      this.loading = false;
    });
  }

  /**
   * NUEVO: Marcar módulo como completado
   */
  marcarModuloCompletado(modulo: ModuleData) {
    if (!modulo.id) {
      this.snackBar.open('❌ Error: ID de módulo inválido', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.registrationId) {
      this.snackBar.open('❌ Error: No hay registro de inscripción', 'Cerrar', { duration: 3000 });
      console.error('❌ No hay registrationId disponible');
      return;
    }

    if (this.isModuloCompletado(modulo.id)) {
      this.snackBar.open('ℹ️ Este módulo ya está completado', 'Cerrar', { duration: 3000 });
      return;
    }

    // Calcular tiempo dedicado
    const timeDedicated = this.progressService.calculateTimeDedicated(this.moduleStartTime);

    console.log('⏱️ Marcando módulo como completado:', {
      moduleId: modulo.id,
      registrationId: this.registrationId,
      timeDedicated,
      moduloTitulo: modulo.title
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

        // Mostrar notificación con animación
        const progressPercent = progress.moduleProgress.toFixed(0);
        this.snackBar.open(
          `🎉 ¡Módulo "${modulo.title}" completado! Progreso del curso: ${progressPercent}%`,
          'Cerrar',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );

        // Verificar si completó el curso
        if (progress.moduleProgress >= 100) {
          setTimeout(() => {
            this.snackBar.open(
              '🎊 ¡FELICITACIONES! Has completado el curso. ¡Tu certificado está disponible!',
              'Ver certificado',
              {
                duration: 8000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              }
            );
          }, 5500);
        }
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

          // Mostrar resumen en consola
          console.table(history.map(h => ({
            'Módulo': h.moduleId,
            'Progreso': `${h.moduleProgress.toFixed(1)}%`,
            'Tiempo': h.timeDedicated,
            'Estado': h.status
          })));

          this.snackBar.open(
            `📊 Tienes ${history.length} registros de progreso. Revisa la consola para más detalles.`,
            'Cerrar',
            { duration: 5000 }
          );
        },
        error: (err) => {
          console.error('❌ Error obteniendo historial:', err);
          this.snackBar.open(
            '❌ No se pudo cargar el historial de progreso',
            'Cerrar',
            { duration: 3000 }
          );
        }
      });
    } else {
      this.snackBar.open(
        'ℹ️ No hay registro de progreso disponible',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  descargarMaterial(material: any) {
    console.log('📥 Descargar material:', material);
    this.snackBar.open('Funcionalidad de descarga en desarrollo', 'Cerrar', { duration: 2000 });
  }

  verLink(material: any) {
    console.log('🔗 Abrir link:', material);
    this.snackBar.open('Funcionalidad de enlaces en desarrollo', 'Cerrar', { duration: 2000 });
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
