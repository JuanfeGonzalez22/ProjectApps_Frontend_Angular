import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ModuleData {
  id?: number;
  courseId: number;
  title: string;
  type: string;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = 'http://localhost:8080/api/v1/modules'; // URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<ModuleData[]> {
    return this.http.get<ModuleData[]>(this.apiUrl);
  }

  getById(id: number): Observable<ModuleData> {
    return this.http.get<ModuleData>(`${this.apiUrl}/${id}`);
  }

  create(module: ModuleData): Observable<ModuleData> {
    return this.http.post<ModuleData>(this.apiUrl, module);
  }

  update(id: number, module: ModuleData): Observable<ModuleData> {
    return this.http.put<ModuleData>(`${this.apiUrl}/${id}`, module);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
