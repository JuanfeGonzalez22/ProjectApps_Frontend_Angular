import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CourseInstructorResponse {
  id: number;
  courseId: number;
  courseName: string;
  instructorId: number;
  instructorName: string;
  assignedAt: string;
}

export interface CourseDetails {
  id: number;
  title: string;
  description: string;
  estimatedDuration: string;
  level: number;
  // Agregar más campos según tu CourseEntity
}

@Injectable({
  providedIn: 'root'
})
export class CourseInstructorService {
  private apiUrl = 'http://localhost:8080/api/v1/course-instructors';
  private coursesUrl = 'http://localhost:8080/api/v1/courses';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todas las asignaciones y filtrar por el instructor actual
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

  // Obtener detalles adicionales de un curso
  getCourseDetails(courseId: number): Observable<CourseDetails> {
    return this.http.get<CourseDetails>(`${this.coursesUrl}/${courseId}`, {
      headers: this.getHeaders()
    });
  }


}
