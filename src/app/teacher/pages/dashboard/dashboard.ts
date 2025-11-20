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
import { MisCursos } from './sections/mis-cursos/mis-cursos';
import { CalificarEvaluaciones } from './sections/calificar-evaluaciones/calificar-evaluaciones';
import { ReportesCursos } from './sections/reportes-cursos/reportes-cursos';
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'app-teacher-dashboard',
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
    MisCursos,
    CalificarEvaluaciones,
    ReportesCursos,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  user = 'Instructor';
  section: string = 'inicio';
  
  // Datos de ejemplo para el instructor
  cursosAsignados: any[] = [];
  evaluacionesPendientes: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser.fullName || 'Instructor';
    }

    // Cargar datos del instructor
    this.cargarDatosInstructor();
  }

  setSection(seccion: string) {
    this.section = seccion;
  }

  cargarDatosInstructor() {
    // Aquí integrarás con tus servicios reales
    this.evaluacionesPendientes = 3; // Ejemplo
  }

  logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}