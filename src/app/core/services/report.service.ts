// src/app/core/services/repor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportStaticsDTO, ReportDTO, CourseReport } from '../models/report-statics.dto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api/v1/reports';


  constructor(private http: HttpClient) { }

  // Crear nuevo reporte
  createReport(report: ReportDTO): Observable<ReportStaticsDTO> {
    return this.http.post<ReportStaticsDTO>(this.apiUrl, report);
  }

  // Obtener todos los reportes
  getAllReports(): Observable<ReportStaticsDTO[]> {
    return this.http.get<ReportStaticsDTO[]>(this.apiUrl);
  }

  // Obtener reporte por ID
  getReportById(id: number): Observable<ReportStaticsDTO> {
    return this.http.get<ReportStaticsDTO>(`${this.apiUrl}/${id}`);
  }

  // Actualizar reporte
  updateReport(id: number, report: ReportDTO): Observable<ReportStaticsDTO> {
    return this.http.put<ReportStaticsDTO>(`${this.apiUrl}/${id}`, report);
  }

  // Eliminar reporte
  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Generar reporte de instructor
  generateInstructorReport(instructorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/${instructorId}`);
  }

  // Obtener reportes de cursos (si tienes este endpoint)
  getCourseReports(): Observable<CourseReport[]> {
    return this.http.get<CourseReport[]>(`${this.apiUrl}/courses`);
  }
}
