// src/app/admin/pages/dashboard/sections/asignacion-instructores/gestion-asignacion-instructores.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CourseInstructorServiceAsig } from '../../../../../core/services/course-instructor-asig.service';
import { CourseService } from '../../../../../core/services/course.service';
import { UserService } from '../../../../../core/services/user.service';
import { CourseInstructorResponse } from '../../../../../core/models/course-instructor.model';
import { AsignarInstructorComponent } from './asignar-instructor/asignar-instructor';

@Component({
  selector: 'app-gestion-asignacion-instructores',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    FormsModule,
    AsignarInstructorComponent
  ],
  templateUrl: './gestion-asignacion-instructores.html',
  styleUrls: ['./gestion-asignacion-instructores.scss']
})
export class GestionAsignacionInstructores implements OnInit {
  // ✅ Datos principales
  asignaciones: CourseInstructorResponse[] = [];
  asignacionesFiltradas: CourseInstructorResponse[] = [];
  instructores: any[] = [];
  cursos: any[] = [];
  cursosDisponibles: any[] = [];
  
  // ✅ Control de vistas
  searchTerm: string = '';
  section: string = 'asignacion-instructores';
  vista: 'tabla' | 'asignar' = 'tabla';
  asignacionSeleccionada: CourseInstructorResponse | null = null;
  fechaCarga: string = '';

  constructor(
    private courseInstructorServiceAsig: CourseInstructorServiceAsig,
    private userService: UserService,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fechaCarga = new Date().toLocaleString();
    
    window.addEventListener('changeSection', (event: any) => {
      this.section = event.detail;
    });

    this.cargarDatos();
  }

  cargarDatos() {
    console.log('🔄 Iniciando carga de datos...');
    
    this.courseInstructorServiceAsig.getAllAssignments().subscribe({
      next: (asignaciones) => {
        this.asignaciones = asignaciones;
        this.asignacionesFiltradas = [...asignaciones];
        console.log('✅ Asignaciones cargadas:', asignaciones.length);
        this.cargarInstructoresYCursos();
      },
      error: (error) => {
        console.error('❌ Error cargando asignaciones:', error);
      }
    });
  }

  cargarInstructoresYCursos() {
    console.log('🔄 Cargando instructores y cursos...');
    
    this.userService.getAllUsers().subscribe({
      next: (usuarios) => {
        this.instructores = usuarios.filter(user => user.role === 'INSTRUCTOR');
        console.log('👥 Instructores cargados:', this.instructores.length);
        this.cargarCursos();
      },
      error: (error) => {
        console.error('❌ Error cargando instructores:', error);
      }
    });
  }

  cargarCursos() {
    console.log('🔄 Cargando cursos...');
    
    this.courseService.getAllCourses().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        console.log('📚 Todos los cursos cargados:', this.cursos.length);
        this.calcularCursosDisponibles();
      },
      error: (error) => {
        console.error('❌ Error cargando cursos:', error);
      }
    });
  }

  calcularCursosDisponibles() {
    console.log('🔄 Calculando cursos disponibles...');
    console.log('📊 Cursos totales:', this.cursos);
    console.log('📋 Asignaciones existentes:', this.asignaciones);
    
    this.cursosDisponibles = this.courseInstructorServiceAsig.getAvailableCourses(
      this.cursos, 
      this.asignaciones
    );
    
    console.log('🎯 Cursos disponibles calculados:', this.cursosDisponibles.length);
    console.log('📝 Lista de cursos disponibles:', this.cursosDisponibles);
  }

  getCursosPorInstructor(instructorId: number): CourseInstructorResponse[] {
    return this.courseInstructorServiceAsig.getCoursesByInstructor(instructorId, this.asignaciones);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  desasignarInstructor(event: Event, asignacion: CourseInstructorResponse) {
    event.stopPropagation();
    
    const confirmar = confirm(
      `¿Desasignar a ${asignacion.instructorName} del curso "${asignacion.courseName}"?`
    );
    
    if (!confirmar) return;

    this.courseInstructorServiceAsig.deleteAssignment(asignacion.id).subscribe({
      next: () => {
        this.asignaciones = this.asignaciones.filter(a => a.id !== asignacion.id);
        this.asignacionesFiltradas = this.asignacionesFiltradas.filter(a => a.id !== asignacion.id);
        this.asignacionSeleccionada = null;
        this.calcularCursosDisponibles();
        alert('✅ Instructor desasignado correctamente');
      },
      error: (err) => {
        console.error('❌ Error desasignando instructor:', err);
        alert('Error al desasignar el instructor');
      }
    });
  }

  onAsignacionCreada(nuevaAsignacion: CourseInstructorResponse) {
    this.asignaciones.push(nuevaAsignacion);
    this.asignacionesFiltradas = [...this.asignaciones];
    this.calcularCursosDisponibles();
    this.vista = 'tabla';
  }

  filtrarAsignaciones() {
    const termino = this.searchTerm.toLowerCase().trim();

    if (!termino) {
      this.asignacionesFiltradas = [...this.asignaciones];
      return;
    }

    this.asignacionesFiltradas = this.asignaciones.filter(asignacion =>
      asignacion.courseName.toLowerCase().includes(termino) ||
      asignacion.instructorName.toLowerCase().includes(termino) ||
      asignacion.id.toString().includes(termino)
    );
  }

  limpiarBusqueda() {
    this.searchTerm = '';
    this.asignacionesFiltradas = [...this.asignaciones];
  }

  seleccionarAsignacion(asignacion: CourseInstructorResponse): void {
    this.asignacionSeleccionada = asignacion;
  }

  volver() { 
    this.setSection('asignacion-instructores');  
  }

  setSection(seccion: string) {
    const event = new CustomEvent('changeSection', { detail: seccion });
    window.dispatchEvent(event);
  }

  nuevaAsignacion() {
    console.log('🔄 Abriendo modal de asignación...');
    console.log('👥 Instructores para modal:', this.instructores.length);
    console.log('📚 Cursos disponibles para modal:', this.cursosDisponibles.length);
    this.vista = 'asignar';
  }

  volverATabla() {
    this.vista = 'tabla';
    this.asignacionSeleccionada = null;
  }
}