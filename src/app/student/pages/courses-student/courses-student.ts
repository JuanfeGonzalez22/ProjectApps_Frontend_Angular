import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CourseService } from '../../../core/services/course.service';
import { CourseData } from '../../../core/models/course.model';
import { CourseDetail } from '../detail-curse-student/course-detail';

@Component({
  selector: 'app-courses-student',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDialogModule,
    CourseDetail
  ],
  templateUrl: './courses-student.html',
  styleUrls: ['./courses-student.scss']
})
export class CoursesStudent implements OnInit {
  cursos: CourseData[] = [];
  loading = true;
  error = '';
  selectedCourseId: number | null = null;
  showDetail = false;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.cargarCursos();
  }

  cargarCursos() {
    this.loading = true;
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.cursos = data;
        this.loading = false;
        console.log('✅ Cursos cargados:', data);
      },
      error: (err) => {
        console.error('❌ Error cargando cursos:', err);
        this.error = 'No se pudieron cargar los cursos';
        this.loading = false;
      }
    });
  }

  verCurso(curso: CourseData) {
    console.log('📖 Ver curso:', curso);
    this.selectedCourseId = curso.id || null; // ✅ Corregido
    this.showDetail = true;
  }

  volverALista() {
    this.showDetail = false;
    this.selectedCourseId = null;
  }

  getNivelColor(level: number): string { // ✅ Cambiado a number
    const niveles: { [key: number]: string } = { // ✅ key es number
      1: 'primary',
      2: 'accent',
      3: 'warn'
    };
    return niveles[level] || 'primary';
  }

  getNivelTexto(level: number): string { // ✅ Cambiado a number
    const niveles: { [key: number]: string } = { // ✅ key es number
      1: 'Básico',
      2: 'Intermedio',
      3: 'Avanzado'
    };
    return niveles[level] || 'Nivel ' + level;
  }

  formatDuration(duration: string): string {
    if (!duration) return 'N/A';
    const parts = duration.split(':');
    if (parts.length >= 2) {
      const horas = parseInt(parts[0]);
      const minutos = parseInt(parts[1]);
      return `${horas}h ${minutos}m`;
    }
    return duration;
  }
}
