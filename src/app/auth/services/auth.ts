import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
}

export interface User {
  id: number;
  fullName?: string;
  name?: string;
  email: string;
  role: string;
  department?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }


  login(emailOrRequest: string | LoginRequest, password?: string): Observable<AuthResponse> {
    let loginData: LoginRequest;

    if (typeof emailOrRequest === 'string') {
      loginData = { email: emailOrRequest, password: password! };
    } else {
      loginData = emailOrRequest;
    }

    console.log(' [AuthService] Enviando login:', loginData);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: AuthResponse) => {
        console.log('[AuthService] Respuesta recibida:', response);

        if (response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          console.log(' [AuthService] Datos guardados en localStorage');
        }
      })
    );
  }


  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log(' [AuthService] Enviando registro:', userData);

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((response: AuthResponse) => {
        console.log(' [AuthService] Registro exitoso:', response);

        if (response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          console.log(' [AuthService] Usuario registrado y guardado');
        }
      })
    );
  }


  logout(): void {
    console.log(' [AuthService] Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }


  getCurrentUser(): User | null {
    return this.currentUserSubject.value || this.getStoredUser();
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
