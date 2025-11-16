import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { Evaluacion } from '../../../../../core/models/evaluation.model';
import { EvaluationService } from '../../../../../core/services/evaluation.service';

@Component({
  selector: 'app-evaluaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './evaluaciones.html',
  styleUrls: ['./evaluaciones.scss'],
})
export class Evaluaciones implements OnInit {

  vista: 'tabla' | 'editar' | 'crear' = 'tabla';

  evaluaciones: Evaluacion[] = [];
  evaluacionesFiltradas: Evaluacion[] = [];

  searchTerm: string = '';

  evaluacionSeleccionada: Evaluacion | null = null;

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit(): void {
    this.cargarEvaluaciones();
  }

  // =======================
  // CARGAR DESDE EL BACKEND
  // =======================
  cargarEvaluaciones(): void {
    console.log('📡 Cargando evaluaciones desde el backend...');
    this.evaluationService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Evaluaciones recibidas:', data);
        this.evaluaciones = data;
        this.evaluacionesFiltradas = [...data];
      },
      error: (err) => {
        console.error('❌ Error cargando evaluaciones:', err);
        this.evaluaciones = [];
        this.evaluacionesFiltradas = [];
      }
    });
  }

  // seleccionar fila
  seleccionarEvaluacion(ev: Evaluacion): void {
    this.evaluacionSeleccionada = ev;
  }

  // filtro simple por título o tipo (ajusta a tus campos)
  filtrarEvaluaciones(): void {
    const termino = this.searchTerm.toLowerCase().trim();

    if (!termino) {
      this.evaluacionesFiltradas = [...this.evaluaciones];
      return;
    }

    this.evaluacionesFiltradas = this.evaluaciones.filter((ev: any) =>
      (ev.title ?? ev.titulo ?? '').toLowerCase().includes(termino) ||
      (ev.type ?? ev.tipo ?? '').toLowerCase().includes(termino)
    );
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.evaluacionesFiltradas = [...this.evaluaciones];
  }

  // =======================
  // ELIMINAR CON BACKEND
  // =======================
  eliminarEvaluacion(): void {
    if (!this.evaluacionSeleccionada) {
      alert('Selecciona una evaluación primero.');
      return;
    }

    const { id } = this.evaluacionSeleccionada;
    const confirmar = confirm(
      `¿Seguro que deseas eliminar la evaluación con ID ${id}?`
    );

    if (!confirmar) return;

    this.evaluationService.delete(id as number).subscribe({
      next: () => {
        // sacarla de las listas en frontend
        this.evaluaciones = this.evaluaciones.filter(e => e.id !== id);
        this.evaluacionesFiltradas = this.evaluacionesFiltradas.filter(e => e.id !== id);
        this.evaluacionSeleccionada = null;

        alert('✅ Evaluación eliminada correctamente desde el backend');
      },
      error: (err) => {
        console.error('❌ Error al eliminar evaluación:', err);
        alert('Error al eliminar la evaluación. Revisa la consola o el backend.');
      }
    });
  }

  // por ahora dejamos editar/crear en “pendiente”
  editarEvaluacion(): void {
    if (!this.evaluacionSeleccionada) {
      alert('Selecciona una evaluación primero.');
      return;
    }
    this.vista = 'editar';
    alert('Más adelante conectamos el formulario de edición 😎');
  }

  crearEvaluacion(): void {
    this.vista = 'crear';
    alert('Más adelante conectamos el formulario de creación 😎');
  }

  volver(): void {
    this.vista = 'tabla';
  }
}
