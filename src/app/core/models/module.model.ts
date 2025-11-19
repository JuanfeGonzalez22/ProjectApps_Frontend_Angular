// src/app/core/models/module.model.ts

export interface ModuleData {
  id?: number;
  title: string;
  description?: string;
  orden: number;    
  tipo?: string;      
  courseId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModuleDTO {
  title: string;
  description?: string;
  orden: number;
  tipo?: string;
  courseId: number;
}
