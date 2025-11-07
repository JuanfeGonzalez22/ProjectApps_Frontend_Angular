import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // Información del administrador al iniciar sesión
  user = 'Administrador';

  // 🔹 Controla qué sección se está mostrando
  section: string = 'inicio'; // Empieza mostrando la información del admin

  // 🔹 Lista de cursos (vacía por ahora)
  cursos: any[] = [];

  // 🔹 Menú lateral
  navItems = [
    { icon: 'home', label: 'Inicio' },
    { icon: 'group', label: 'Usuarios' },
    { icon: 'menu_book', label: 'Cursos' },
    { icon: 'bar_chart', label: 'Reportes' },
    { icon: 'settings', label: 'Configuración' }
  ];

  // Cambiar entre secciones del panel
  setSection(seccion: string) {
    this.section = seccion;
  }

  // Agregar curso (visual por ahora)
  agregarCurso() {
    // En un futuro abrirá un modal o formulario
    alert('Abrir formulario para crear un nuevo curso');
  }
}
