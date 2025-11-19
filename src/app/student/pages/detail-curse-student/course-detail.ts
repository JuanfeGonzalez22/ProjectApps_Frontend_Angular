import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CourseService } from '../../../core/services/course.service';
import { ModuleService } from '../../../core/services/module.service';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { CourseData } from '../../../core/models/course.model';
import { ModuleData } from '../../../core/models/module.model';
import { EvaluationData } from '../../../core/models/evaluation.model';
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
    MatDialogModule
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
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarDetalleCurso();
  }

  cargarDetalleCurso() {
    this.loading = true;

    // Cargar datos del curso
    this.courseService.getById(this.courseId).subscribe({
      next: (curso) => {
        this.curso = curso;
        console.log('✅ Curso cargado:', curso);
        this.cargarModulos();
      },
      error: (err) => {
        console.error('❌ Error cargando curso:', err);
        this.error = 'No se pudo cargar el curso';
        this.loading = false;
      }
    });
  }

  cargarModulos() {
    // Cargar módulos del curso
    this.moduleService.getAll().subscribe({
      next: (modulos) => {
        // Filtrar solo los módulos de este curso
        this.modulos = modulos
          .filter(m => m.courseId === this.courseId)
          .sort((a, b) => a.orden - b.orden);
        console.log('✅ Módulos cargados:', this.modulos);

        // Cargar evaluaciones de todos los módulos
        this.cargarEvaluaciones();
      },
      error: (err) => {
        console.error('❌ Error cargando módulos:', err);
        this.loading = false;
      }
    });
  }

  cargarEvaluaciones() {
    // Obtener evaluaciones de todos los módulos del curso
    const evaluacionesPromises = this.modulos.map(modulo =>
      this.evaluationService.getByModuleId(modulo.id!).toPromise()
    );

    Promise.all(evaluacionesPromises).then(results => {
      this.evaluaciones = results
        .filter(result => result !== undefined)
        .flat() as EvaluationData[];

      console.log('✅ Evaluaciones cargadas:', this.evaluaciones);
      this.loading = false;
    }).catch(err => {
      console.error('❌ Error cargando evaluaciones:', err);
      this.loading = false;
    });
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
    console.log('📊 Ver progreso del curso:', this.courseId);
    // Aquí puedes navegar a una vista de progreso detallado
  }

  descargarMaterial(material: any) {
    console.log('📥 Descargar material:', material);
    // Implementar descarga
  }

  verLink(material: any) {
    console.log('🔗 Abrir link:', material);
    // Implementar apertura de link
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
        // Recargar evaluaciones para actualizar el estado
        this.cargarEvaluaciones();
      }
    });
  }

  verResultado(evaluation: EvaluationData) {
    console.log('📊 Ver resultado:', evaluation);
    // Abrir dialog con los resultados
    this.dialog.open(EvaluationDialogComponent, {
      width: '800px',
      data: { evaluation, viewMode: true }
    });
  }

  getEstadoEvaluacion(evaluation: EvaluationData): string {
    // Por ahora retornamos 'Pendiente', esto se debe obtener del backend
    // consultando los attempts del estudiante
    return 'Pendiente';
  }

  isEvaluacionCompletada(evaluation: EvaluationData): boolean {
    return this.getEstadoEvaluacion(evaluation) === 'Completado';
  }

  getProgresoTotal(): number {
    // Calcular progreso basado en evaluaciones completadas
    if (this.evaluaciones.length === 0) return 0;
    const completados = this.evaluaciones.filter(e =>
      this.getEstadoEvaluacion(e) === 'Completado'
    ).length;
    return Math.round((completados / this.evaluaciones.length) * 100);
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
