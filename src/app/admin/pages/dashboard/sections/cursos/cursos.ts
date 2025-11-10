import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule, 
    MatCard
  ],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.scss']
})
export class Cursos {
  cursos = [
    { id: 1, nombre: 'Angular Básico', instructor: 'Carlos Pérez' },
  ];

  agregarCurso() {
    alert('Abrir formulario para crear un nuevo curso');
  }
}
