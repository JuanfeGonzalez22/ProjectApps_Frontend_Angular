import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseReport {
  courseId: number;
  courseName: string;
  totalStudents: number;
  averageProgress: number;
  averageScore: number;
  completionRate: number;
  totalEnrollments: number;
  activeStudents: number;
  completedStudents: number;
}

export interface InstructorCourseReport {
  instructorId: number;
  instructorName: string;
  assignedCourses: CourseReport[];
  totalStudents: number;
  overallProgress: number;
  overallScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportCoursesService {
  private apiUrl = 'http://localhost:8089/api/v1/reports';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener reporte de cursos para un instructor específico
  getInstructorCourseReport(instructorId: number): Observable<InstructorCourseReport> {
    return this.http.get<InstructorCourseReport>(`${this.apiUrl}/instructor/${instructorId}/courses`, {
      headers: this.getHeaders()
    });
  }

  // Obtener reporte detallado de un curso específico
  getCourseDetailedReport(courseId: number): Observable<CourseReport> {
    return this.http.get<CourseReport>(`${this.apiUrl}/courses/${courseId}`, {
      headers: this.getHeaders()
    });
  }

  // Generar reporte de progreso de estudiantes por curso
  generateStudentProgressReport(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/student-progress`, {
      headers: this.getHeaders()
    });
  }

  // Obtener estadísticas de evaluaciones por curso
  getCourseEvaluationStats(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/evaluation-stats`, {
      headers: this.getHeaders()
    });
  }

  // Exportar reporte a PDF/Excel
  exportCourseReport(courseId: number, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/export?format=${format}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}