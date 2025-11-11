import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
  providedIn: 'root';
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
