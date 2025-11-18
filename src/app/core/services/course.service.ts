import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseData, CourseDTO } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/v1/courses';

  constructor(private http: HttpClient) {}

  // ✅ MÉTODO PARA OBTENER HEADERS CON TOKEN
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

  getAll(): Observable<CourseData[]> {
    return this.http.get<CourseData[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getById(id: number): Observable<CourseData> {
    return this.http.get<CourseData>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  create(course: CourseDTO): Observable<CourseData> {
    return this.http.post<CourseData>(this.apiUrl, course, {
      headers: this.getHeaders()
    });
  }

  update(id: number, course: CourseDTO): Observable<CourseData> {
    return this.http.put<CourseData>(`${this.apiUrl}/${id}`, course, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
