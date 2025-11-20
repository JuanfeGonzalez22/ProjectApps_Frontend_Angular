// src/app/core/services/progress-history.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgressHistory } from '../models/progress-history.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressHistoryService {
  private apiUrl = 'http://localhost:8080/api/v1/progress';

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

  /**
   * Marca un módulo como completado
   * @param moduleId ID del módulo
   * @param registrationId ID de la inscripción
   * @param timeDedicated Tiempo dedicado en formato "HH:MM"
   */
  markModuleAsCompleted(
    moduleId: number,
    registrationId: number,
    timeDedicated: string = "00:30"
  ): Observable<ProgressHistory> {
    const params = new HttpParams()
      .set('registrationId', registrationId.toString())
      .set('timeDedicated', timeDedicated);

    return this.http.post<ProgressHistory>(
      `${this.apiUrl}/modules/${moduleId}/mark-completed`,
      null,
      {
        headers: this.getHeaders(),
        params: params
      }
    );
  }

  /**
   * Obtiene el progreso actual de un estudiante en un curso
   * @param registrationId ID de la inscripción
   */
  getCurrentProgress(registrationId: number): Observable<ProgressHistory> {
    return this.http.get<ProgressHistory>(
      `${this.apiUrl}/current/${registrationId}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Obtiene el historial completo de progreso
   * @param registrationId ID de la inscripción
   */
  getProgressHistory(registrationId: number): Observable<ProgressHistory[]> {
    return this.http.get<ProgressHistory[]>(
      `${this.apiUrl}/history/${registrationId}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  /**
   * Verifica si un módulo específico está completado
   * @param registrationId ID de la inscripción
   * @param moduleId ID del módulo
   */
  isModuleCompleted(registrationId: number, moduleId: number): Observable<boolean> {
    const params = new HttpParams()
      .set('registrationId', registrationId.toString())
      .set('moduleId', moduleId.toString());

    return this.http.get<boolean>(
      `${this.apiUrl}/check-module`,
      {
        headers: this.getHeaders(),
        params: params
      }
    );
  }

  /**
   * Calcula el tiempo dedicado desde un timestamp inicial
   * @param startTime Timestamp de inicio
   * @returns Tiempo en formato "HH:MM"
   */
  calculateTimeDedicated(startTime: number): string {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
