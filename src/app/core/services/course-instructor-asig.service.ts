import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CourseInstructorDTO, CourseInstructorResponse } from '../models/course-instructor.model';

@Injectable({
  providedIn: 'root'
})
export class CourseInstructorServiceAsig {
  private apiUrl = 'http://localhost:8089/api/v1/course-instructors';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getMyCourses(): Observable<CourseInstructorResponse[]> {
      return this.http.get<CourseInstructorResponse[]>(this.apiUrl, {
        headers: this.getHeaders()
      }).pipe(
        map(asignaciones => {
          // Obtener el usuario actual del localStorage
          const currentUserStr = localStorage.getItem('user');
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            // Filtrar asignaciones por el instructorId del usuario actual
            return asignaciones.filter(asignacion => 
              asignacion.instructorId === currentUser.id
            );
          }
          return [];
        })
      );
    }

  // ✅ Obtener todas las asignaciones
  getAllAssignments(): Observable<CourseInstructorResponse[]> {
    return this.http.get<CourseInstructorResponse[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // ✅ Crear nueva asignación
  createAssignment(assignment: CourseInstructorDTO): Observable<CourseInstructorResponse> {
    return this.http.post<CourseInstructorResponse>(this.apiUrl, assignment, {
      headers: this.getHeaders()
    });
  }

  // ✅ Eliminar asignación
  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Obtener asignación por ID
  getAssignmentById(id: number): Observable<CourseInstructorResponse> {
    return this.http.get<CourseInstructorResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }


getAvailableCourses(allCourses: any[], currentAssignments: CourseInstructorResponse[]): any[] {
  const assignedCourseIds = currentAssignments.map(assignment => assignment.courseId);
  return allCourses.filter(course => !assignedCourseIds.includes(course.id));
}

getCoursesByInstructor(instructorId: number, currentAssignments: CourseInstructorResponse[]): CourseInstructorResponse[] {
  return currentAssignments.filter(assignment => assignment.instructorId === instructorId);
}
}