import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../../../core/services/course.service';
import { CourseData } from '../../../../../core/models/course.model';
import { EditarCursoComponent } from './editar-curso/editar-curso';

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

  cursos: CourseData[] = [];
  cursosFiltrados: CourseData[] = [];

  searchTerm: string = '';
  section: string = 'cursos';

  vista: 'tabla' | 'editar' = 'tabla';
  cursoSeleccionado: CourseData | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  volver() {
 this.setSection('cursos');  }

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

        this.cursos = courses;
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
      c.id === curso.id ? curso : c
    );

    this.filtrarCursos();
    this.vista = 'tabla';
  }

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

  limpiarBusqueda() {
    this.searchTerm = '';
    this.cursosFiltrados = [...this.cursos];
  }

  formatearDuracion(duracion: any): string {
    if (!duracion) return 'No especificada';

    let duracionStr = duracion;

    if (typeof duracion === 'object') {

      duracionStr = duracion.toString();
    }

    const partes = duracionStr.split(':');
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

    return duracionStr;
  }

  seleccionarCurso(curso: CourseData): void {
    this.cursoSeleccionado = curso;
    console.log(' Curso seleccionado:', curso);
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
        alert('Curso eliminado correctamente ');
      },
      error: err => {
        console.error(' Error eliminando curso:', err);
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


  gestionarModulosCurso(): void {
    console.log('🎯 Navegando a Gestión de Módulos generales');


    this.setSection('gestion-modulos');
  }
}
