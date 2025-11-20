// src/app/core/services/report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportStaticsDTO, ReportDTO, CourseReport } from '../models/report-statics.dto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8089/api/v1/reports';

  constructor(private http: HttpClient) { }

  // ✅ AGREGA ESTE MÉTODO (igual que los otros servicios)
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

  // ✅ ACTUALIZA TODOS LOS MÉTODOS CON HEADERS
  createReport(report: ReportDTO): Observable<ReportStaticsDTO> {
    return this.http.post<ReportStaticsDTO>(this.apiUrl, report, {
      headers: this.getHeaders()
    });
  }

  getAllReports(): Observable<ReportStaticsDTO[]> {
    return this.http.get<ReportStaticsDTO[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getReportById(id: number): Observable<ReportStaticsDTO> {
    return this.http.get<ReportStaticsDTO>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateReport(id: number, report: ReportDTO): Observable<ReportStaticsDTO> {
    return this.http.put<ReportStaticsDTO>(`${this.apiUrl}/${id}`, report, {
      headers: this.getHeaders()
    });
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  generateInstructorReport(instructorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instructor/${instructorId}`, {
      headers: this.getHeaders()
    });
  }

  getCourseReports(): Observable<CourseReport[]> {
    return this.http.get<CourseReport[]>(`${this.apiUrl}/courses`, {
      headers: this.getHeaders()
    });
  }
}