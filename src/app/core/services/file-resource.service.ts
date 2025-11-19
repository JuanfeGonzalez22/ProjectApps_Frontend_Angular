// src/app/core/services/file-resource.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileResourceDTO {
  id?: number;
  fileName: string;
  fileType: string;
  moduleId?: number;
  evaluationId?: number;
  fileUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileResourceService {
  private apiUrl = 'http://localhost:8080/api/v1/file-resources';

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

  // Crear recurso de archivo
  createFileResource(fileResource: FileResourceDTO): Observable<FileResourceDTO> {
    return this.http.post<FileResourceDTO>(this.apiUrl, fileResource, {
      headers: this.getHeaders()
    });
  }

  // Obtener recurso por ID
  getFileResourceById(id: number): Observable<FileResourceDTO> {
    return this.http.get<FileResourceDTO>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener todos los recursos
  getAllFileResources(): Observable<FileResourceDTO[]> {
    return this.http.get<FileResourceDTO[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Actualizar recurso
  updateFileResource(id: number, fileResource: FileResourceDTO): Observable<FileResourceDTO> {
    return this.http.put<FileResourceDTO>(`${this.apiUrl}/${id}`, fileResource, {
      headers: this.getHeaders()
    });
  }

  // Eliminar recurso
  deleteFileResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener recursos por módulo
  getFileResourcesByModule(moduleId: number): Observable<FileResourceDTO[]> {
    return this.http.get<FileResourceDTO[]>(`${this.apiUrl}/module/${moduleId}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener recursos por evaluación
  getFileResourcesByEvaluation(evaluationId: number): Observable<FileResourceDTO[]> {
    return this.http.get<FileResourceDTO[]>(`${this.apiUrl}/evaluation/${evaluationId}`, {
      headers: this.getHeaders()
    });
  }

  // Método auxiliar para subir archivo con multipart/form-data
  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    // Headers sin Content-Type para que el navegador lo configure automáticamente con el boundary
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      : new HttpHeaders();

    // Retorna la URL del archivo subido
    return this.http.post<string>(`${this.apiUrl}/upload`, formData, {
      headers: headers,
      responseType: 'text' as 'json' // El backend retorna un string con la URL
    });
  }
}
