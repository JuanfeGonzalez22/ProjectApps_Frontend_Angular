import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuleData, ModuleDTO } from '../models/module.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = 'http://localhost:8080/api/v1/modules';

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

  getAll(): Observable<ModuleData[]> {
    return this.http.get<ModuleData[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }


  getByCourseId(courseId: number): Observable<ModuleData[]> {
    return this.http.get<ModuleData[]>(`${this.apiUrl}/course/${courseId}`, {
      headers: this.getHeaders()
    });
  }

  getById(id: number): Observable<ModuleData> {
    return this.http.get<ModuleData>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  create(module: ModuleDTO): Observable<ModuleData> {
    return this.http.post<ModuleData>(this.apiUrl, module, {
      headers: this.getHeaders()
    });
  }

  update(id: number, module: ModuleDTO): Observable<ModuleData> {
    return this.http.put<ModuleData>(`${this.apiUrl}/${id}`, module, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
