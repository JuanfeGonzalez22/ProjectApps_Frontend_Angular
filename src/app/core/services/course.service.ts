import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export interface CourseData {
  id?: number;
  title: string;
  description?: string;
  instructor?: string;
  estimatedDuration?: string;
  level?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/v1/courses'; //URL

  constructor(private http: HttpClient) {}

  // Obtener todos los cursos
  getAll(): Observable<CourseData[]> {
    console.log('🔍 Llamando a:', this.apiUrl);
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((courses, index) => {
        console.log('📦 Respuesta cruda del backend:', courses);

        
        return courses.map((course, idx) => ({
          id: idx + 1, 
          title: course.title,
          description: course.description,
          estimatedDuration: course.estimatedDuration,
          level: course.level
        }));
      }),
      tap(data => console.log('✅ Cursos mapeados:', data)),
      catchError(error => {
        console.error('❌ Error en getAll:', error);
        return of([]);
      })
    );
  }

  // Obtener un curso por ID
  getById(id: number): Observable<CourseData> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(course => ({
        id: id, // Usar el ID que pasamos
        title: course.title,
        description: course.description,
        estimatedDuration: course.estimatedDuration,
        level: course.level
      }))
    );
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
