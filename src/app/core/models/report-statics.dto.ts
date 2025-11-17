// src/app/core/models/report-statics.dto.ts
export interface ReportStaticsDTO {
  reportId: number;
  totalUsers: number;
  totalCourses: number;
  totalRegistrations: number;
  totalCertificates: number;
  averageProgress: number;
  averageScores: number;
  usersByRole: { [key: string]: number };
  createdAt: string;
  updatedAt: string;
}

export interface ReportDTO {
  title: string;
  description: string;
  userId?: number;
  courseId?: number;
}

export interface CourseReport {
  id: number;
  nombre: string;
  inscritos: number;
  finalizados: number;
  porcentajeFinalizados: number;
}