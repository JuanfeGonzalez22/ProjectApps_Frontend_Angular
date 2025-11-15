import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../../../core/services/course.service';
import { CourseData } from '../../../../../core/models/course.model';
import { EditarCursoComponent } from './editar-curso/editar-curso';

interface Curso {
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
    MatTableModule,
    FormsModule,
    EditarCursoComponent
  ],
  templateUrl: './gestion-cursos.html',
  styleUrls: ['./gestion-cursos.scss']
})
export class GestionCursos implements OnInit {
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  searchTerm: string = '';
  section: string = 'cursos';

  vista: 'tabla' | 'editar' = 'tabla';
  cursoSeleccionado: Curso | null = null;

  constructor(private courseService: CourseService) {}

  volver() { history.back(); }

  setSection(seccion: string) {
    const event = new CustomEvent('changeSection', { detail: seccion });
    window.dispatchEvent(event);
  }

  ngOnInit() {
    window.addEventListener('changeSection', (event: any) => {
      this.section = event.detail;
    });

    this.cargarCursos();
  }

  cargarCursos() {
    this.courseService.getAll().subscribe({
      next: (courses: CourseData[]) => {
        this.cursos = courses.map(course => ({
          id: course.id || 0,
          title: course.title,
          description: course.description || '',
          estimatedDuration: course.estimatedDuration || '',
          level: course.level?.toString() || ''
        }));
        this.cursosFiltrados = [...this.cursos];
        console.log('Cursos cargados:', this.cursos);
      },
      error: (error) => {
        console.error('Error al cargar cursos:', error);
        this.cursos = [];
        this.cursosFiltrados = [];
      }
    });
  }

  onCursoActualizado(curso: CourseData) {
    this.cursos = this.cursos.map(c =>
      c.id === curso.id
        ? {
            id: curso.id || 0,
            title: curso.title,
            description: curso.description || '',
            estimatedDuration: curso.estimatedDuration || '',
            level: curso.level?.toString() || ''
          }
        : c
    );

    // volver a aplicar filtros
    this.filtrarCursos();

    // volver a la tabla
    this.vista = 'tabla';
  }

  // filtrar cursos
  filtrarCursos() {
    const termino = this.searchTerm.toLowerCase().trim();

    if (!termino) {
      this.cursosFiltrados = [...this.cursos];
      return;
    }

    this.cursosFiltrados = this.cursos.filter(curso =>
      curso.title.toLowerCase().includes(termino) ||
      curso.description.toLowerCase().includes(termino)
    );

    console.log(`Búsqueda: "${termino}" - Resultados: ${this.cursosFiltrados.length}`);
  }

  // limpiar búsqueda
  limpiarBusqueda() {
    this.searchTerm = '';
    this.cursosFiltrados = [...this.cursos];
  }

  formatearDuracion(duracion: string): string {
    if (!duracion || duracion === '' || duracion === null || duracion === undefined) {
      return 'No especificada';
    }

    const partes = duracion.split(':');
    if (partes.length === 3) {
      const horas = parseInt(partes[0], 10);
      const minutos = parseInt(partes[1], 10);
      const segundos = parseInt(partes[2], 10);

      let resultado = '';

      if (horas > 0) {
        resultado += `${horas}h `;
      }
      if (minutos > 0) {
        resultado += `${minutos}min`;
      }
      if (horas === 0 && minutos === 0 && segundos > 0) {
        resultado += `${segundos}s`;
      }

      return resultado.trim() || 'No especificada';
    }

    return duracion;
  }

  abrirModulos() {
    window.open('/admin/modulos', '_blank');
  }

  seleccionarCurso(curso: Curso) {
    this.cursoSeleccionado = curso;
    console.log("Curso seleccionado:", curso);
  }

  
  eliminarCurso(): void {
    if (!this.cursoSeleccionado || this.cursoSeleccionado.id == null) {
      alert('Selecciona un curso primero.');
      return;
    }

    const confirmar = confirm(
      `¿Seguro que deseas eliminar el curso "${this.cursoSeleccionado.title}" (ID: ${this.cursoSeleccionado.id})?`
    );
    if (!confirmar) return;

    this.courseService.delete(this.cursoSeleccionado.id).subscribe({
      next: () => {
        this.cursos = this.cursos.filter(
          c => c.id !== this.cursoSeleccionado!.id
        );
        this.cursosFiltrados = this.cursosFiltrados.filter(
          c => c.id !== this.cursoSeleccionado!.id
        );

        this.cursoSeleccionado = null;
        alert('Curso eliminado correctamente ✅');
      },
      error: err => {
        console.error('❌ Error eliminando curso:', err);
        alert('Error al eliminar el curso.');
      }
    });
  }

  editarCurso() {
    if (!this.cursoSeleccionado) {
      alert('Selecciona primero un curso de la tabla.');
      return;
    }
    this.vista = 'editar';
  }
}
