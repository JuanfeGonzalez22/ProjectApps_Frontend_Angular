export interface CourseData {
  id?: number;
  title: string;
  description: string;
  estimatedDuration: string; // LocalTime se maneja como string "HH:mm:ss"
  level: number;
}

// DTO para crear/actualizar (sin id)
export interface CourseDTO {
  title: string;
  description: string;
  estimatedDuration: string;
  level: number;
}