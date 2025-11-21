import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModuleService } from '../../../../../core/services/module.service';
import { ModuleData } from '../../../../../core/models/module.model';
import { AgregarModuloComponent } from './agregar-modulo/agregar-modulo';
import { EditarModuloComponent } from './editar-modulo/editar-modulo';

@Component({
  selector: 'app-gestion-modulos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    AgregarModuloComponent,
    EditarModuloComponent
  ],
  templateUrl: './gestion-modulos.html',
  styleUrls: ['./gestion-modulos.scss']
})
export class GestionModulos implements OnInit {
  modulos: ModuleData[] = [];
  modulosFiltrados: ModuleData[] = [];
  searchTerm: string = '';
  moduloSeleccionado: ModuleData | null = null;

  vista: 'lista' | 'crear' | 'editar' = 'lista';

  constructor(
    private router: Router,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.cargarModulos();
  }

  cargarModulos(): void {
    console.log(' Cargando módulos...');
    this.moduleService.getAll().subscribe({
      next: (data: ModuleData[]) => {
        console.log(' Módulos recibidos:', data);
        this.modulos = data;
        this.modulosFiltrados = [...data];
      },
      error: (err: any) => {
        console.error('Error cargando módulos:', err);
        this.modulos = [];
        this.modulosFiltrados = [];
      }
    });
  }

  filtrarModulos(): void {
    const termino = this.searchTerm.toLowerCase().trim();

    if (!termino) {
      this.modulosFiltrados = [...this.modulos];
      return;
    }


    this.modulosFiltrados = this.modulos.filter(modulo =>
      modulo.title?.toLowerCase().includes(termino) ||
      modulo.description?.toLowerCase().includes(termino) ||
      modulo.id?.toString().includes(termino) ||
      modulo.courseId?.toString().includes(termino) ||
      modulo.orden?.toString().includes(termino)
    );

    console.log(`Búsqueda: "${termino}" - Resultados: ${this.modulosFiltrados.length}`);
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.modulosFiltrados = [...this.modulos];
  }

  crearModulo(): void {
    this.vista = 'crear';
  }

  editarModulo(): void {
    if (this.moduloSeleccionado) {
      this.vista = 'editar';
    }
  }

  eliminarModulo(): void {
    if (!this.moduloSeleccionado) {
      alert('Primero selecciona un módulo de la tabla.');
      return;
    }

    const confirmado = confirm(
      `¿Seguro que quieres eliminar el módulo "${this.moduloSeleccionado.title}" (ID: ${this.moduloSeleccionado.id})?`
    );

    if (!confirmado) return;

    const id = this.moduloSeleccionado.id!;

    this.moduleService.delete(id).subscribe({
      next: () => {
        console.log('Módulo eliminado:', id);
        this.modulos = this.modulos.filter(m => m.id !== id);
        this.modulosFiltrados = this.modulosFiltrados.filter(m => m.id !== id);
        this.moduloSeleccionado = null;
        alert('Módulo eliminado correctamente.');
      },
      error: (err: any) => {
        console.error('Error eliminando módulo:', err);
        alert('Ocurrió un error al eliminar el módulo.');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/admin/cursos']);
  }

  seleccionarModulo(modulo: ModuleData): void {
    this.moduloSeleccionado = modulo;
    console.log('Módulo seleccionado:', modulo);
  }

  onModuloCreado(nuevoModulo: ModuleData): void {
    this.modulos = [...this.modulos, nuevoModulo];
    this.modulosFiltrados = [...this.modulos];
    this.vista = 'lista';
    this.moduloSeleccionado = null;
  }

  onModuloActualizado(moduloActualizado: ModuleData): void {
    this.modulos = this.modulos.map(m =>
      m.id === moduloActualizado.id ? moduloActualizado : m
    );
    this.modulosFiltrados = [...this.modulos];
    this.vista = 'lista';
    this.moduloSeleccionado = null;
  }

  volverALista(): void {
    this.vista = 'lista';
    this.moduloSeleccionado = null;
  }
}
