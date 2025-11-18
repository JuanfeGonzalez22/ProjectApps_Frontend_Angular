// src/app/core/models/module.model.ts

export interface ModuleData {
  id?: number;
  title: string;
  description?: string;
  orden: number;      // ✅ Se mantiene en español
  tipo?: string;      // ✅ AGREGADO: para type (video, texto, quiz, etc)
  courseId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModuleDTO {
  title: string;
  description?: string;
  orden: number;
  tipo?: string;
  courseId: number;
}
