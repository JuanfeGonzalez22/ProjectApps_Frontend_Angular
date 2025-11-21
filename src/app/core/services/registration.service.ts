// src/app/core/services/registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationDTO, RegistrationResponse } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:8080/api/v1/registrations';

  constructor(private http: HttpClient) {}

  // ✅ AGREGA ESTE MÉTODO (igual que en CourseService)
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
  getAll(): Observable<RegistrationResponse[]> {
    return this.http.get<RegistrationResponse[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getById(id: number): Observable<RegistrationResponse> {
    return this.http.get<RegistrationResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  create(registration: RegistrationDTO): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.apiUrl, registration, {
      headers: this.getHeaders()
    });
  }

  update(id: number, registration: RegistrationDTO): Observable<RegistrationDTO> {
    return this.http.put<RegistrationDTO>(`${this.apiUrl}/${id}`, registration, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
