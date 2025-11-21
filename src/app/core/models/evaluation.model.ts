// src/app/core/models/evaluation.model.ts

export interface EvaluationData {
  id?: number;  
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
