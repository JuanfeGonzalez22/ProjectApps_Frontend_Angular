// src/app/admin/pages/dashboard/dashboard.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Inicio } from './sections/inicio/inicio';
import { Usuarios } from './sections/usuarios/usuarios';
import { Cursos } from './sections/cursos/cursos';
import { GestionCursos } from './sections/gestion-cursos/gestion-cursos';
import { ReportesComponent as Reportes } from './sections/reportes/reportes';
import { Configuracion } from './sections/configuracion/configuracion';
import { GestionModulos } from "./sections/gestion-modulos/gestion-modulos";
import { GestionEvaluaciones } from "./sections/gestion-evaluaciones/gestion-evaluaciones"; // ✅ AGREGADO
import { AuthService } from '../../../auth/services/auth';
import { GestionInscripciones } from "./sections/inscripcion/gestion-inscripciones";
import { GestionAsignacionInstructores } from "./sections/asignacion-instructores/gestion-asignacion-instructores"; 
import { GestionGamificacion } from "./sections/gamificacion/gestion-gamificacion";



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    Inicio,
    Usuarios,
    Cursos,
    GestionCursos,
    Reportes,
    Configuracion,
    GestionModulos,
    GestionEvaluaciones,
    GestionInscripciones,
    GestionAsignacionInstructores,
    GestionGamificacion
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  user = 'Administrador';
  section: string = 'inicio';
  cursos: any[] = [];
  usuarios: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser.fullName || 'Administrador';
    }

    window.addEventListener('changeSection', (event: any) => {
      this.section = event.detail;
    });
  }

  setSection(seccion: string) {
    this.section = seccion;
  }

  agregarCurso() {
    alert('Abrir formulario para crear un nuevo curso');
  }

  logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
