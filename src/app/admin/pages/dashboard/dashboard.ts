import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Inicio } from './sections/inicio/inicio';
import { Usuarios } from './sections/usuarios/usuarios';
import { Cursos } from './sections/cursos/cursos';
import { GestionCursos } from './sections/gestion-cursos/gestion-cursos';
import { Reportes } from './sections/reportes/reportes';
import { Configuracion } from './sections/configuracion/configuracion';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    Inicio,
    Usuarios,
    Cursos,
    GestionCursos,
    Reportes,
    Configuracion
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  user = 'Administrador';
  section: string = 'inicio';
  cursos: any[] = [];
  usuarios: any[] = [];

  setSection(seccion: string) {
    this.section = seccion;
  }

  agregarCurso() {
    alert('Abrir formulario para crear un nuevo curso');
  }
}
