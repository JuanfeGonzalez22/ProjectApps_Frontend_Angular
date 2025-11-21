// src/app/core/services/rating.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RatingDTO, RatingResponse } from '../models/rating.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private apiUrl = 'http://localhost:8089/api/v1/ratings';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ MÉTODO DE PRUEBA PARA DIAGNÓSTICO
  testBackendConnection(): Observable<HttpResponse<any>> {
    console.log('🔍 Probando conexión con:', this.apiUrl);
    
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      observe: 'response' // Para ver toda la respuesta
    });
  }

  getAll(): Observable<RatingResponse[]> {
    return this.http.get<RatingResponse[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getById(id: number): Observable<RatingResponse> {
    return this.http.get<RatingResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  create(data: RatingDTO): Observable<RatingResponse> {
    return this.http.post<RatingResponse>(this.apiUrl, data, {
      headers: this.getHeaders()
    });
  }

  update(id: number, data: RatingDTO): Observable<RatingResponse> {
    return this.http.put<RatingResponse>(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  searchByName(name: string): Observable<RatingResponse[]> {
    return this.http.get<RatingResponse[]>(`${this.apiUrl}/search?name=${name}`, {
      headers: this.getHeaders()
    });
  }

  checkCodeExists(code: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${code}`, {
      headers: this.getHeaders()
    });
  }

  getTiposDisponibles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tipos-disponibles`, {
      headers: this.getHeaders()
    });
  }

  constructor(private http: HttpClient) {}
}