import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CourseInstructorService } from '../../../../../core/services/course-instructor.service';
import { CourseInstructorResponse } from '../../../../../core/models/course-instructor.model';
@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './mis-cursos.html',
  styleUrls: ['./mis-cursos.scss']
})
export class MisCursos implements OnInit {
  cursos: any[] = [];
  loading = true;
  error = '';

  constructor(private courseInstructorService: CourseInstructorService) {}

  ngOnInit() {
    this.cargarMisCursos();
  }

  cargarMisCursos() {
    this.loading = true;
    this.courseInstructorService.getMyCourses().subscribe({
      next: (asignaciones: CourseInstructorResponse[]) => {
        console.log('📚 Asignaciones del instructor:', asignaciones);
        
        // Transformar las asignaciones al formato del template
        this.cursos = asignaciones.map(asignacion => ({
          id: asignacion.courseId,
          nombre: asignacion.courseName,
          descripcion: `Curso asignado el ${this.formatearFecha(asignacion.assignedAt)}`,
          categoria: this.obtenerCategoriaPorNombre(asignacion.courseName),
          estudiantes: this.generarNumeroAleatorio(15, 40), // Simulado
          modulos: this.generarNumeroAleatorio(3, 8), // Simulado
          evaluaciones: this.generarNumeroAleatorio(2, 5), // Simulado
          progreso: 0, // Por implementar
          duracion: this.generarDuracionAleatoria(),
          nivel: this.obtenerNivelAleatorio(),
          fechaAsignacion: asignacion.assignedAt,
          asignacionId: asignacion.id
        }));
        
        this.loading = false;
        console.log('✅ Cursos transformados:', this.cursos);
      },
      error: (error) => {
        console.error('❌ Error cargando cursos:', error);
        this.error = 'Error al cargar los cursos asignados';
        this.loading = false;
        
        // Datos de ejemplo para testing
        this.cargarDatosEjemplo();
      }
    });
  }

  // Métodos auxiliares para datos de ejemplo
  private formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  private obtenerCategoriaPorNombre(nombreCurso: string): string {
    if (nombreCurso.toLowerCase().includes('python') || nombreCurso.toLowerCase().includes('web')) {
      return 'Desarrollo Web';
    } else if (nombreCurso.toLowerCase().includes('java') || nombreCurso.toLowerCase().includes('programación')) {
      return 'Programación';
    } else if (nombreCurso.toLowerCase().includes('base') || nombreCurso.toLowerCase().includes('datos')) {
      return 'Base de Datos';
    }
    return 'Desarrollo';
  }

  private generarNumeroAleatorio(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generarDuracionAleatoria(): string {
    const horas = this.generarNumeroAleatorio(1, 4);
    const minutos = this.generarNumeroAleatorio(0, 59);
    return `${horas}h ${minutos}m`;
  }

  private obtenerNivelAleatorio(): string {
    const niveles = ['Básico', 'Intermedio', 'Avanzado'];
    return niveles[Math.floor(Math.random() * niveles.length)];
  }

  private cargarDatosEjemplo() {
    this.cursos = [
      {
        id: 1,
        nombre: 'Desarrollo Web con Python',
        descripcion: 'Curso introductorio sobre desarrollo web con Python',
        categoria: 'Desarrollo Web',
        estudiantes: 25,
        modulos: 6,
        evaluaciones: 3,
        progreso: 0,
        duracion: '1h 30m',
        nivel: 'Básico',
        fechaAsignacion: '2024-01-15'
      },
      {
        id: 2,
        nombre: 'Programación en Java',
        descripcion: 'Clase que explica Programación Orientada a Objetos',
        categoria: 'Programación',
        estudiantes: 18,
        modulos: 4,
        evaluaciones: 2,
        progreso: 0,
        duracion: '2h 15m',
        nivel: 'Intermedio',
        fechaAsignacion: '2024-01-10'
      }
    ];
  }

  verDetallesCurso(curso: any) {
    console.log('🔍 Ver detalles del curso:', curso);
    // Navegar a detalles del curso
  }

  editarCurso(curso: any) {
    console.log('✏️ Gestionar curso:', curso);
    // Navegar a gestión del curso
  }

  verReportesCurso(curso: any) {
    console.log('📊 Ver reportes del curso:', curso);
    // Navegar a reportes del curso
  }
}