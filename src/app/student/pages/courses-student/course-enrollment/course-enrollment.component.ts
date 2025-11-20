// src/app/student/pages/courses-student/course-enrollment/course-enrollment.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../../core/services/course.service';
import { RegistrationService } from '../../../../core/services/registration.service';
import { CourseData } from '../../../../core/models/course.model';
import { RegistrationDTO } from '../../../../core/models/registration.model';

@Component({
  selector: 'app-course-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-enrollment.component.html',
  styleUrls: ['./course-enrollment.component.scss']
})
export class CourseEnrollmentComponent implements OnInit {
  availableCourses: CourseData[] = [];
  selectedCourseId: number | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  userId: number = 0;

  constructor(
    private courseService: CourseService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.loadUserId();
    this.loadAvailableCourses();
  }

  loadUserId(): void {
    // Obtener el userId del localStorage o del servicio de autenticación
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user.id;
    }
  }

  loadAvailableCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Cargar inscripciones del usuario primero
    this.registrationService.getAll().subscribe({
      next: (registrations) => {
        // Obtener IDs de cursos donde ya está inscrito
        const enrolledCourseIds = registrations
          .filter(r => r.userId === this.userId)
          .map(r => r.courseId);

        // Cargar todos los cursos
        this.courseService.getAll().subscribe({
          next: (courses) => {
            // ✅ FILTRAR: Solo mostrar cursos donde NO está inscrito
            this.availableCourses = courses.filter(
              course => !enrolledCourseIds.includes(course.id!)
            );
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al cargar cursos:', error);
            this.errorMessage = 'No se pudieron cargar los cursos disponibles';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar inscripciones:', error);
        // Si falla, mostrar todos los cursos
        this.courseService.getAll().subscribe({
          next: (courses) => {
            this.availableCourses = courses;
            this.isLoading = false;
          }
        });
      }
    });
  }

  selectCourse(courseId: number): void {
    this.selectedCourseId = courseId;
    this.errorMessage = '';
    this.successMessage = '';
  }

  enrollInCourse(): void {
    if (!this.selectedCourseId) {
      this.errorMessage = 'Por favor selecciona un curso';
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'No se pudo identificar al usuario';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registration: RegistrationDTO = {
      userId: this.userId,
      courseId: this.selectedCourseId,
      status: 'ACTIVE'
    };

    this.registrationService.create(registration).subscribe({
      next: (response) => {
        this.successMessage = '¡Te has inscrito exitosamente al curso!';
        this.selectedCourseId = null;
        this.isLoading = false;

        // Opcional: redirigir después de 2 segundos
        setTimeout(() => {
          this.successMessage = '';
          // Recargar cursos para actualizar la lista
          this.loadAvailableCourses();
        }, 3000);
      },
      error: (error) => {
        console.error('Error al inscribirse:', error);
        if (error.status === 409) {
          this.errorMessage = 'Ya estás inscrito en este curso';
        } else if (error.status === 400) {
          this.errorMessage = 'Datos de inscripción inválidos';
        } else {
          this.errorMessage = 'Error al inscribirse al curso. Por favor intenta nuevamente.';
        }
        this.isLoading = false;
      }
    });
  }

  getLevelText(level: number): string {
    const levels: { [key: number]: string } = {
      1: 'Principiante',
      2: 'Intermedio',
      3: 'Avanzado'
    };
    return levels[level] || 'No especificado';
  }

  closeDialog(): void {
    this.selectedCourseId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
}
