export interface ModuleData {
  id?: number;
  courseId: number;
  title: string;
  type: string;
  order: number;
}

export interface ModuleDTO {
  courseId: number;
  title: string;
  type: string;
  order: number;
}