<<<<<<< HEAD
export interface Evaluacion {
  id: number;
  moduleId: number;
  title: string;
  type: string;
  maxScore: number;
}
=======
// src/app/core/models/evaluation.model.ts

export interface EvaluationData {
  id?: number;  // ✅ AGREGAR ESTE CAMPO (opcional porque al crear no lo tenemos)
  moduleId: number;
  title: string;
  type: string;
  maxScore: number;
  description?: string;
  dueDate?: string;
}

export interface EvaluationDTO {
  moduleId: number;
  title: string;
  type: string;
  maxScore: number;
  description?: string;
  dueDate?: string;
}

export interface EvaluationAttempt {
  evaluationId: number;
  studentId: number;
  submissionDate?: string;
  fileUrl?: string;
  fileName?: string;
  score?: number;
  status: 'PENDING' | 'GRADED' | 'COMPLETED';
  feedback?: string;
}

export interface EvaluationSubmissionDTO {
  evaluationId: number;
  studentId: number;
  file?: File;
}
>>>>>>> 23319b5e20272b93a5d2c415cacc35697ab7e466
