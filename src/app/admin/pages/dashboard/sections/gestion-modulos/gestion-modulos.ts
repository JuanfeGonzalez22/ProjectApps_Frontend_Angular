import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

interface Modulo {
  id: number;
  courseId: number;
  title: string;
  type: string;
  order: number;
}

@Component({
  selector: 'app-gestion-modulos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './gestion-modulos.html',
  styleUrl: './gestion-modulos.scss',
})
export class GestionModulos {
  modulos: Modulo[] = [];

  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/admin/cursos']);
  }
}
