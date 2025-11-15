import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { CourseData } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/v1/courses';

  constructor(private http: HttpClient) {}

  // Obtener todos los cursos
  getAll(): Observable<CourseData[]> {
    return this.http.get<CourseData[]>(this.apiUrl).pipe(
      tap(data => console.log('📚 Cursos del backend:', data)),
      catchError(error => {
        console.error('❌ Error en getAll:', error);
        return of([]);
      })
    );
  }

  // Obtener un curso por ID
  getById(id: number): Observable<CourseData> {
    return this.http.get<CourseData>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo curso
  create(course: CourseData): Observable<CourseData> {
    return this.http.post<CourseData>(this.apiUrl, course);
  }

  // Actualizar un curso
  update(id: number, course: CourseData): Observable<CourseData> {
    return this.http.put<CourseData>(`${this.apiUrl}/${id}`, course);
  }

  // Eliminar un curso
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}