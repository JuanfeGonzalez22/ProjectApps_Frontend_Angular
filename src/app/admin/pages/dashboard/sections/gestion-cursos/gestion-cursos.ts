import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Cursos } from '../cursos/cursos';

interface Curso{
  id: number;
  title: string;
  description: string;
  estimatedDuration: string;
  level: string;
}

@Component({
  selector: 'app-gestion-cursos',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './gestion-cursos.html',
  styleUrls: ['./gestion-cursos.scss']
})

export class GestionCursos {
  cursos: Curso[] = [];
  section: string = 'cursos';
  volver() { history.back(); }

  setSection(seccion: string) {
    this.section = seccion;
  }
}

