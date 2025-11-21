// src/app/core/models/rating.model.ts
export interface RatingDTO {
  name: string;
  criterion: string;
  icono: string;
  code: string;
}

export interface RatingResponse {
  id: number;
  name: string;
  criterion: string;
  icono: string;
  code: string;
}