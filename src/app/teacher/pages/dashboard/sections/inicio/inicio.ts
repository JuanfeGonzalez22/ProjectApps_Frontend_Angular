import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio implements OnInit {
  stats = {
    cursosActivos: 5,
    evaluacionesPendientes: 12,
    estudiantesActivos: 85,
    completacionPromedio: 92
  };

  actividadReciente = [
    {
      icono: 'assignment_turned_in',
      descripcion: 'Juan Pérez completó el módulo "Introducción a Angular"',
      tiempo: 'Hace 2 horas'
    },
    {
      icono: 'quiz',
      descripcion: 'María García envió la evaluación "TypeScript Avanzado"',
      tiempo: 'Hace 4 horas'
    },
    {
      icono: 'forum',
      descripcion: 'Nueva pregunta en el foro de "Spring Boot"',
      tiempo: 'Hace 6 horas'
    }
  ];

  ngOnInit() {
    // Aquí cargarás los datos reales desde tu servicio
  }
}