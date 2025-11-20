import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface AnswerResponseDTO {
  id: number;
  date: string;
  evaluationId: number;
  userId: number;
  score: number | null;
}

export interface EvaluationDTO {
  id: number;
  moduleId: number;
  title: string;
  type: string;
  maxScore: number;
}

export interface GradeAnswerDTO {
  score: number;
  feedback?: string;
}

export interface AnswerWithDetails extends AnswerResponseDTO {
  evaluationTitle?: string;
  studentName?: string;
  courseName?: string;
  moduleName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = 'http://localhost:8089/api/v1/answers';
  private evaluationsUrl = 'http://localhost:8089/api/v1/evaluaciones';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todas las respuestas pendientes de calificación
  getPendingAnswers(): Observable<AnswerResponseDTO[]> {
    return this.http.get<AnswerResponseDTO[]>(this.apiUrl, {
      headers: this.getHeaders()
    }).pipe(
      map(answers => answers.filter(answer => answer.score === null))
    );
  }

  // Obtener respuestas por evaluación (para un curso específico)
  getAnswersByEvaluation(evaluationId: number): Observable<AnswerResponseDTO[]> {
    return this.http.get<AnswerResponseDTO[]>(`${this.apiUrl}/evaluation/${evaluationId}`, {
      headers: this.getHeaders()
    });
  }

  // Calificar una respuesta
  gradeAnswer(answerId: number, gradeData: GradeAnswerDTO): Observable<AnswerResponseDTO> {
    return this.http.put<AnswerResponseDTO>(`${this.apiUrl}/${answerId}/grade`, gradeData, {
      headers: this.getHeaders()
    });
  }

  // Obtener evaluación por ID
  getEvaluationById(evaluationId: number): Observable<EvaluationDTO> {
    return this.http.get<EvaluationDTO>(`${this.evaluationsUrl}/${evaluationId}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener todas las evaluaciones
  getAllEvaluations(): Observable<EvaluationDTO[]> {
    return this.http.get<EvaluationDTO[]>(this.evaluationsUrl, {
      headers: this.getHeaders()
    });
  }
}