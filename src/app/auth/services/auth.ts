import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  department?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
  message: string;
}

@Injectable({ 
  providedIn: 'root' 
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/project/api/v1/auth';

  constructor(private http: HttpClient) {}

  // Headers explícitos para evitar problemas de CORS
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🌐 [AuthService] URL de login:', `${this.apiUrl}/login`);
    console.log('📦 [AuthService] Datos enviados:', credentials);
    
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`, 
      credentials,
      { 
        headers: this.getHeaders(),
        withCredentials: true // Importante para CORS
      }
    ).pipe(
      tap(response => {
        console.log('✅ [AuthService] Login exitoso - Respuesta:', response);
        
        if (response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('💾 [AuthService] Token y usuario guardados en localStorage');
          console.log('🔐 [AuthService] Token:', response.token.substring(0, 20) + '...');
          console.log('👤 [AuthService] Usuario:', response.user.email);
        } else {
          console.error('❌ [AuthService] Respuesta incompleta - Sin token o usuario');
        }
      }),
      catchError(this.handleError('login'))
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('🌐 [AuthService] URL de registro:', `${this.apiUrl}/register`);
    console.log('📦 [AuthService] Datos enviados:', userData);
    
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`, 
      userData,
      { 
        headers: this.getHeaders(),
        withCredentials: true
      }
    ).pipe(
      tap(response => {
        console.log('✅ [AuthService] Registro exitoso - Respuesta:', response);
        
        if (response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('💾 [AuthService] Token y usuario guardados en localStorage');
          console.log('👤 [AuthService] Usuario registrado:', response.user.email);
        }
      }),
      catchError(this.handleError('register'))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🚪 [AuthService] Sesión cerrada - Datos eliminados');
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('🔍 [AuthService] Token obtenido:', token ? token.substring(0, 20) + '...' : 'null');
    return token;
  }

  getUser(): UserResponse | null {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('🔍 [AuthService] Usuario obtenido:', user?.email || 'null');
    return user;
  }

  isLoggedIn(): boolean {
    const isLogged = !!this.getToken();
    console.log('🔐 [AuthService] Usuario autenticado:', isLogged);
    return isLogged;
  }

  // Manejo centralizado de errores
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`❌ [AuthService] Error en ${operation}:`, error);
      
      let errorMessage = 'Error desconocido';
      
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        errorMessage = `Error ${error.status}: ${error.message}`;
        
        // Mensajes específicos por código de error
        switch (error.status) {
          case 0:
            errorMessage = 'No se pudo conectar con el servidor';
            break;
          case 403:
            errorMessage = 'Acceso denegado - Problema de CORS o permisos';
            break;
          case 404:
            errorMessage = 'Endpoint no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
        }
        
        // Si el backend envía un mensaje de error específico
        if (error.error && error.error.message) {
          errorMessage += ` - ${error.error.message}`;
        }
      }
      
      console.error(`❌ [AuthService] Mensaje de error para el usuario: ${errorMessage}`);
      return throwError(() => new Error(errorMessage));
    };
  }

  // Método para verificar la conexión con el backend
  checkBackendConnection(): Observable<any> {
    console.log('🔌 [AuthService] Verificando conexión con el backend...');
    return this.http.get(`${this.apiUrl}/health`, { 
      headers: this.getHeaders(),
      withCredentials: true 
    }).pipe(
      tap(() => console.log('✅ [AuthService] Backend conectado correctamente')),
      catchError(this.handleError('health check'))
    );
  }
}