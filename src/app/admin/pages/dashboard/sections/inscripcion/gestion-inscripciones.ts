import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { RegistrationService } from '../../../../../core/services/registration.service';
import { RegistrationResponse } from '../../../../../core/models/registration.model';
import { AgregarInscripcionComponent } from './agregar-inscripcion/agregar-inscripcion';
import { EditarInscripcionComponent } from './editar-inscripcion/editar-inscripcion';

@Component({
  selector: 'app-gestion-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    AgregarInscripcionComponent,
    EditarInscripcionComponent
  ],
  templateUrl: './gestion-inscripciones.html',
  styleUrls: ['./gestion-inscripciones.scss']
})
export class GestionInscripciones implements OnInit {
  inscripciones: RegistrationResponse[] = [];
  inscripcionesFiltradas: RegistrationResponse[] = [];
  
  searchTerm: string = '';
  section: string = 'inscripciones';

  // ✅ NUEVO: Control de vistas
  vista: 'tabla' | 'agregar' | 'editar' = 'tabla';
  inscripcionSeleccionada: RegistrationResponse | null = null;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  volver() { 
    this.setSection('inscripciones');  
  }

  setSection(seccion: string) {
    const event = new CustomEvent('changeSection', { detail: seccion });
    window.dispatchEvent(event);
  }

  ngOnInit() {
    window.addEventListener('changeSection', (event: any) => {
      this.section = event.detail;
    });

    this.cargarInscripciones();
  }

  cargarInscripciones() {
    this.registrationService.getAll().subscribe({
      next: (inscripciones: RegistrationResponse[]) => {
        this.inscripciones = inscripciones;
        this.inscripcionesFiltradas = [...this.inscripciones];
        console.log('Inscripciones cargadas:', this.inscripciones);
      },
      error: (error) => {
        console.error('Error al cargar inscripciones:', error);
        this.inscripciones = [];
        this.inscripcionesFiltradas = [];
      }
    });
  }

  // En gestion-inscripciones.ts - actualiza el método filtrarInscripciones
filtrarInscripciones() {
  const termino = this.searchTerm.toLowerCase().trim();

  if (!termino) {
    this.inscripcionesFiltradas = [...this.inscripciones];
    return;
  }

  this.inscripcionesFiltradas = this.inscripciones.filter(inscripcion =>
    // ✅ BUSCAR POR ID (convertido a string para comparar)
    inscripcion.id?.toString().includes(termino) ||
    
    // ✅ BUSCAR POR NOMBRE DE USUARIO
    inscripcion.userName.toLowerCase().includes(termino) ||
    
    // ✅ BUSCAR POR EMAIL DE USUARIO
    inscripcion.userEmail.toLowerCase().includes(termino) ||
    
    // ✅ BUSCAR POR TÍTULO DEL CURSO
    inscripcion.courseTitle.toLowerCase().includes(termino) ||
    
    // ✅ BUSCAR POR ESTADO
    inscripcion.status.toLowerCase().includes(termino)
  );

  console.log(`🔍 Búsqueda: "${termino}" - Resultados: ${this.inscripcionesFiltradas.length}`);
}

  limpiarBusqueda() {
    this.searchTerm = '';
    this.inscripcionesFiltradas = [...this.inscripciones];
  }

  formatearProgreso(progreso: number): string {
    return `${progreso}%`;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  seleccionarInscripcion(inscripcion: RegistrationResponse): void {
    this.inscripcionSeleccionada = inscripcion;
    console.log('✅ Inscripción seleccionada:', inscripcion);
  }

  eliminarInscripcion(): void {
    if (!this.inscripcionSeleccionada || this.inscripcionSeleccionada.id == null) {
      alert('Selecciona una inscripción primero.');
      return;
    }

    const confirmar = confirm(
      `¿Seguro que deseas eliminar la inscripción de "${this.inscripcionSeleccionada.userName}" en "${this.inscripcionSeleccionada.courseTitle}"?`
    );
    if (!confirmar) return;

    this.registrationService.delete(this.inscripcionSeleccionada.id).subscribe({
      next: () => {
        this.inscripciones = this.inscripciones.filter(
          i => i.id !== this.inscripcionSeleccionada!.id
        );
        this.inscripcionesFiltradas = this.inscripcionesFiltradas.filter(
          i => i.id !== this.inscripcionSeleccionada!.id
        );

        this.inscripcionSeleccionada = null;
        alert('Inscripción eliminada correctamente ✅');
      },
      error: err => {
        console.error('❌ Error eliminando inscripción:', err);
        alert('Error al eliminar la inscripción.');
      }
    });
  }

  // ✅ NUEVO: Métodos para modales
  nuevaInscripcion() {
    this.vista = 'agregar';
  }

  editarInscripcion() {
    if (!this.inscripcionSeleccionada) {
      alert('Selecciona primero una inscripción de la tabla.');
      return;
    }
    this.vista = 'editar';
  }

  onInscripcionCreada(nuevaInscripcion: RegistrationResponse) {
    this.inscripciones.push(nuevaInscripcion);
    this.filtrarInscripciones();
    this.vista = 'tabla';
    this.inscripcionSeleccionada = null;
  }

  onInscripcionActualizada(inscripcionActualizada: RegistrationResponse) {
    this.inscripciones = this.inscripciones.map(i => 
      i.id === inscripcionActualizada.id ? inscripcionActualizada : i
    );
    this.filtrarInscripciones();
    this.vista = 'tabla';
    this.inscripcionSeleccionada = null;
  }

  volverATabla() {
    this.vista = 'tabla';
    this.inscripcionSeleccionada = null;
  }
}