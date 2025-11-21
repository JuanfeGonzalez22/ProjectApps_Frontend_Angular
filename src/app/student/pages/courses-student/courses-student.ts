// src/app/student/pages/courses-student/courses-student.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { CourseService } from '../../../core/services/course.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { CourseData } from '../../../core/models/course.model';
import { CourseDetail } from '../detail-curse-student/course-detail';  // ⬅️ AGREGAR

interface CourseWithProgress extends CourseData {
  inscrito?: boolean;
  progress?: number;
  enrollmentId?: number;
}

@Component({
  selector: 'app-courses-student',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    CourseDetail  // ⬅️ AGREGAR AQUÍ
  ],
  templateUrl: './courses-student.html',
  styleUrls: ['./courses-student.scss']
})
export class CoursesStudent implements OnInit {
  cursos: CourseWithProgress[] = [];
  isLoading = false;
  errorMessage = '';
  userId: number = 0;
  showDetail = false;
  selectedCourseId: number | null = null;

  constructor(
    private courseService: CourseService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.loadUserId();
    this.loadCourses();
  }

  loadUserId(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user.id;
    }
  }

  loadCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Primero cargar las inscripciones del usuario
    this.registrationService.getAll().subscribe({
      next: (registrations) => {
        // Filtrar SOLO las inscripciones del usuario actual
        const userRegistrations = registrations.filter(
          r => r.userId === this.userId
        );

        // Si no tiene inscripciones, mostrar vacío
        if (userRegistrations.length === 0) {
          this.cursos = [];
          this.isLoading = false;
          return;
        }

        // Obtener los IDs de los cursos inscritos
        const enrolledCourseIds = userRegistrations.map(r => r.courseId);

        // Cargar TODOS los cursos
        this.courseService.getAll().subscribe({
          next: (allCourses) => {
            // ✅ FILTRAR: Solo mostrar cursos donde el estudiante ESTÁ INSCRITO
            this.cursos = allCourses
              .filter(course => enrolledCourseIds.includes(course.id!))
              .map(course => {
                const registration = userRegistrations.find(
                  r => r.courseId === course.id
                );

                return {
                  ...course,
                  inscrito: true,  // Siempre true porque ya está filtrado
                  progress: registration?.progress || 0,
                  enrollmentId: registration?.id,
                  name: course.title,
                  duration: course.estimatedDuration
                };
              });

            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al cargar cursos:', error);
            this.errorMessage = 'Error al cargar los cursos';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar inscripciones:', error);
        this.errorMessage = 'Error al cargar tus inscripciones';
        this.isLoading = false;
      }
    });
  }

  getProgresoCurso(curso: CourseWithProgress): number {
    return curso.progress || 0;
  }

  formatDuration(duration: string): string {
    return duration || 'No especificada';
  }

  getLevelText(level: number): string {
    const levels: { [key: number]: string } = {
      1: 'Principiante',
      2: 'Intermedio',
      3: 'Avanzado'
    };
    return levels[level] || 'No especificado';
  }

  getNivelColor(level: number): 'primary' | 'accent' | 'warn' {
    const colors: { [key: number]: 'primary' | 'accent' | 'warn' } = {
      1: 'primary',
      2: 'accent',
      3: 'warn'
    };
    return colors[level] || 'primary';
  }

  getNivelTexto(level: number): string {
    return this.getLevelText(level);
  }

  inscribirseACurso(curso: CourseWithProgress): void {
    if (!curso.id || curso.inscrito) return;

    this.isLoading = true;

    const registration = {
      userId: this.userId,
      courseId: curso.id,
      status: 'ACTIVE'
    };

    this.registrationService.create(registration).subscribe({
      next: (response) => {
        const index = this.cursos.findIndex(c => c.id === curso.id);
        if (index !== -1) {
          this.cursos[index].inscrito = true;
          this.cursos[index].progress = 0;
          this.cursos[index].enrollmentId = response.id;
        }
        this.isLoading = false;
        alert('¡Te has inscrito exitosamente al curso!');
      },
      error: (error) => {
        console.error('Error al inscribirse:', error);
        this.isLoading = false;
        if (error.status === 409) {
          alert('Ya estás inscrito en este curso');
        } else {
          alert('Error al inscribirse al curso');
        }
      }
    });
  }

  continuarCurso(curso: CourseWithProgress): void {
    console.log('Continuando curso:', curso.title);
    // Implementar navegación al curso
  }

  verDetalleCurso(curso: CourseWithProgress): void {
    console.log('Ver detalles del curso:', curso.title);
    this.selectedCourseId = curso.id || null;
    this.showDetail = true;
  }

  volverALista(): void {
    this.showDetail = false;
    this.selectedCourseId = null;
    this.loadCourses();
  }
}
