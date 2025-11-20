// src/app/core/models/registration.model.ts

export interface Registration {
  id?: number;
  userId: number;
  courseId: number;
  progress: number;
  enrollmentDate: string; // o Date si prefieres
  status: string;
}

export interface RegistrationDTO {
  userId: number;
  courseId: number;
  status: string;
}

export interface RegistrationResponse {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  courseId: number;
  courseTitle: string;
  progress: number;
  enrollmentDate: string;
  status: string;
}