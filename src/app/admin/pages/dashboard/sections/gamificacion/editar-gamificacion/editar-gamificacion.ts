// src/app/admin/pages/dashboard/sections/gamificacion/editar-gamificacion/editar-gamificacion.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete'; // ✅ AGREGADO
import { RatingService } from '../../../../../../core/services/rating.service';
import { RatingDTO, RatingResponse } from '../../../../../../core/models/rating.model';

@Component({
  selector: 'app-editar-gamificacion',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule // ✅ AGREGADO
  ],
  templateUrl: './editar-gamificacion.html',
  styleUrls: ['./editar-gamificacion.scss']
})
export class EditarGamificacionComponent implements OnInit {
  @Input() elemento!: RatingResponse;
  @Output() volver = new EventEmitter<void>();
  @Output() elementoActualizado = new EventEmitter<RatingResponse>();
  
  formulario: FormGroup;
  opcionesIconos = [
    { value: '🏆', label: 'Trofeo' },
    { value: '🥇', label: 'Medalla Oro' },
    { value: '🥈', label: 'Medalla Plata' },
    { value: '🥉', label: 'Medalla Bronce' },
    { value: '⭐', label: 'Estrella' },
    { value: '👑', label: 'Corona' },
    { value: '💎', label: 'Diamante' },
    { value: '🚀', label: 'Cohete' },
    { value: '🎯', label: 'Diana' },
    { value: '📚', label: 'Libros' },
    { value: '🧠', label: 'Cerebro' },
    { value: '⚡', label: 'Rayo' }
  ];

  // Tipos de logros disponibles desde el backend
  tiposLogros: string[] = [];

  constructor(
    private fb: FormBuilder,
    private ratingService: RatingService
  ) {
    this.formulario = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      criterion: ['', [Validators.required, Validators.minLength(5)]],
      icono: ['🏆', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_-]+$/)]]
    });
  }

  ngOnInit() {
    // Cargar datos del elemento en el formulario
    if (this.elemento) {
      this.formulario.patchValue({
        name: this.elemento.name,
        criterion: this.elemento.criterion,
        icono: this.elemento.icono,
        code: this.elemento.code
      });
    }

    // Cargar tipos de logros disponibles
    this.cargarTiposLogros();
  }

  cargarTiposLogros() {
    this.ratingService.getTiposDisponibles().subscribe({
      next: (tipos) => {
        // Extraer solo los códigos de los tipos (primera parte antes del '-')
        this.tiposLogros = tipos.map(tipo => {
          const parts = tipo.split(' - ');
          return parts[0]; // Retorna solo el código (ej: "PRIMERA_RESPUESTA")
        });
      },
      error: (error) => {
        console.error('Error cargando tipos de logros:', error);
        // Tipos por defecto en caso de error
        this.tiposLogros = [
          'PRIMERA_RESPUESTA',
          'RESPONDEDOR_NOVATO', 
          'RESPONDEDOR_ACTIVO',
          'RESPONDEDOR_EXPERTO',
          'EXPERTO_RESPUESTAS',
          'MAESTRO_RESPUESTAS',
          'BUEN_ESTUDIANTE',
          'EXCELENTE_CALIFICACION',
          'SOBRESALIENTE',
          'PERFECTO_EVALUACION',
          'GENIO_CALIFICACIONES'
        ];
      }
    });
  }

  // Método helper para obtener el label del ícono
  getIconLabel(iconValue: string): string {
    const icon = this.opcionesIconos.find(opt => opt.value === iconValue);
    return icon ? icon.label : '';
  }

  guardar() {
    if (this.formulario.valid && this.elemento) {
      const datos: RatingDTO = this.formulario.value;
      
      // Si cambió el código, verificar que no exista
      if (datos.code !== this.elemento.code) {
        this.ratingService.checkCodeExists(datos.code).subscribe({
          next: (existe) => {
            if (existe) {
              alert('El código ya existe. Por favor use otro código.');
              return;
            }
            this.actualizarElemento(datos);
          },
          error: (error) => console.error('Error verificando código:', error)
        });
      } else {
        this.actualizarElemento(datos);
      }
    } else {
      this.marcarControlesComoTocados();
    }
  }

  private actualizarElemento(datos: RatingDTO) {
    this.ratingService.update(this.elemento.id, datos).subscribe({
      next: (actualizado) => {
        this.elementoActualizado.emit(actualizado);
      },
      error: (error) => {
        console.error('Error actualizando gamificación:', error);
        alert('Error al actualizar la gamificación: ' + error.message);
      }
    });
  }

  cancelar() {
    this.volver.emit();
  }

  private marcarControlesComoTocados() {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.markAsTouched();
    });
  }
}