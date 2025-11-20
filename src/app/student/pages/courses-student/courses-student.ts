// src/app/student/pages/courses-student/courses-student.ts

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
import { AuthService } from '../../../auth/services/auth';

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
  selectedRegistrationId: number | null = null; // NUEVO
  showDetail = false;
  userId: number | null = null; // NUEVO

  constructor(
    private courseService: CourseService,
    private authService: AuthService // NUEVO
  ) {}

  ngOnInit() {
    // Obtener el usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;
    }

    this.cargarCursos();
  }

  cargarCursos() {
    this.loading = true;
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.cursos = data;
        this.loading = false;
        console.log('Cursos cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando cursos:', err);
        this.error = 'No se pudieron cargar los cursos';
        this.loading = false;
      }
    });
  }

  verCurso(curso: CourseData) {
    console.log('📖 Ver curso:', curso);

    this.selectedCourseId = curso.id || null;

    // IMPORTANTE: Aquí necesitas obtener el registrationId real
    // Este ID viene de la inscripción del estudiante al curso
    // Por ahora usaremos un valor temporal, pero DEBES implementar
    // un servicio de inscripciones (registrations) que te devuelva este ID

    // OPCIÓN 1: Si tienes un servicio de inscripciones
    // this.registrationService.getRegistrationByUserAndCourse(this.userId, curso.id)
    //   .subscribe(registration => {
    //     this.selectedRegistrationId = registration.id;
    //     this.showDetail = true;
    //   });

    // OPCIÓN 2: Temporal - usar el ID del curso como registrationId
    // (esto NO es correcto para producción)
    this.selectedRegistrationId = curso.id || 1;

    console.log('⚠️ IMPORTANTE: Usando registrationId temporal:', this.selectedRegistrationId);
    console.log('Debes implementar un servicio de Registration para obtener el ID real');

    this.showDetail = true;
  }

  volverALista() {
    this.showDetail = false;
    this.selectedCourseId = null;
    this.selectedRegistrationId = null;
  }

  getNivelColor(level: number): string {
    const niveles: { [key: number]: string } = {
      1: 'primary',
      2: 'accent',
      3: 'warn'
    };
    return niveles[level] || 'primary';
  }

  getNivelTexto(level: number): string {
    const niveles: { [key: number]: string } = {
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
