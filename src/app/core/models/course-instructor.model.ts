// src/app/core/models/course-instructor.model.ts
export interface CourseInstructorDTO {
  courseId: number;
  instructorId: number;
}

export interface CourseInstructorResponse {
  id: number;
  courseId: number;
  courseName: string;
  instructorId: number;
  instructorName: string;
  assignedAt: string;
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  // otros campos que devuelva tu backend
}

export interface Course {
  id: number;
  title: string;
  level: string;
  // otros campos que devuelva tu backend
}