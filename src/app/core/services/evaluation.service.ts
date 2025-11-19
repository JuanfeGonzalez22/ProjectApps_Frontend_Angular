<<<<<<< HEAD
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluacion } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private baseUrl = 'http://localhost:8080/api/v1/evaluations'; // 👈 ajusta si tu ruta es otra

  constructor(private http: HttpClient) {}

  // Obtener todas las evaluaciones
  getAll(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.baseUrl);
  }

  // Eliminar una evaluación por ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
=======
// src/app/core/services/evaluation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvaluationData, EvaluationDTO, EvaluationAttempt } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8080/api/v1/evaluaciones';
  private attemptsUrl = 'http://localhost:8080/api/v1/evaluation-attempts';

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

  // Obtener todas las evaluaciones
  getAll(): Observable<EvaluationData[]> {
    return this.http.get<EvaluationData[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Obtener evaluación por ID
  getById(id: number): Observable<EvaluationData> {
    return this.http.get<EvaluationData>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener evaluaciones por módulo
  getByModuleId(moduleId: number): Observable<EvaluationData[]> {
    return this.http.get<EvaluationData[]>(`${this.apiUrl}/module/${moduleId}`, {
      headers: this.getHeaders()
    });
  }

  // Crear evaluación (solo ADMIN)
  create(evaluation: EvaluationDTO): Observable<EvaluationData> {
    return this.http.post<EvaluationData>(this.apiUrl, evaluation, {
      headers: this.getHeaders()
    });
  }

  // Actualizar evaluación (solo ADMIN)
  update(id: number, evaluation: EvaluationDTO): Observable<EvaluationData> {
    return this.http.put<EvaluationData>(`${this.apiUrl}/${id}`, evaluation, {
      headers: this.getHeaders()
    });
  }

  // Eliminar evaluación (solo ADMIN)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Enviar respuesta de evaluación con archivo
  submitEvaluation(evaluationId: number, file: File): Observable<EvaluationAttempt> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('evaluationId', evaluationId.toString());

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<EvaluationAttempt>(this.attemptsUrl, formData, {
      headers: headers
    });
  }

  // Obtener intentos del estudiante para una evaluación
  getStudentAttempts(evaluationId: number): Observable<EvaluationAttempt[]> {
    return this.http.get<EvaluationAttempt[]>(
      `${this.attemptsUrl}/evaluation/${evaluationId}`,
      { headers: this.getHeaders() }
    );
  }

  // Obtener el último intento del estudiante
  getLatestAttempt(evaluationId: number): Observable<EvaluationAttempt> {
    return this.http.get<EvaluationAttempt>(
      `${this.attemptsUrl}/latest/${evaluationId}`,
      { headers: this.getHeaders() }
    );
  }
}
>>>>>>> 23319b5e20272b93a5d2c415cacc35697ab7e466
