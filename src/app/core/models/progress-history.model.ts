// src/app/core/models/progress-history.model.ts

export interface ProgressHistory {
  userId: number;
  courseId: number;
  moduleId: number;
  registrationId: number;
  timeDedicated: string; // Formato "HH:MM"
  status: string; // "en progreso", "completado"
  moduleProgress: number; // Porcentaje 0-100
  evaluationAttempts: number;
}

export interface MarkModuleCompletedRequest {
  registrationId: number;
  moduleId: number;
  timeDedicated: string; // Formato "HH:MM:SS" o "HH:MM"
}

export interface ModuleProgressStatus {
  moduleId: number;
  isCompleted: boolean;
  progress: number;
  timeDedicated: string;
}
