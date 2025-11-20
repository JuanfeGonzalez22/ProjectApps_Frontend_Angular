// src/app/core/models/course.model.ts

export interface CourseData {
  id?: number;
  title: string;
  description: string;
  estimatedDuration: string;
  level: number;
  // ⬇️ SOLO AGREGA ESTAS 5 LÍNEAS - NO CAMBIES NADA MÁS
  name?: string;
  duration?: string;
  instructor?: string;
  inscrito?: boolean;
  progress?: number;
}

export interface CourseDTO {
  title: string;
  description: string;
  estimatedDuration: string;
  level: number;
}
