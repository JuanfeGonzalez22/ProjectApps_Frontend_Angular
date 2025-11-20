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
  // Nuevos campos para tracking de progreso
  isCompleted?: boolean;
  progress?: number;
  timeDedicated?: string;
}

export interface ModuleDTO {
  title: string;
  description?: string;
  orden: number;
  tipo?: string;
  courseId: number;
}

// Interfaz extendida para módulos con progreso
export interface ModuleWithProgress extends ModuleData {
  isCompleted: boolean;
  progress: number;
  timeDedicated: string;
  canMarkComplete: boolean; // Si ya completó evaluaciones requeridas
}