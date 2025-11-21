// src/app/admin/pages/dashboard/sections/gamificacion/agregar-gamificacion/agregar-gamificacion.component.ts
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RatingService } from '../../../../../../core/services/rating.service';
import { RatingDTO, RatingResponse } from '../../../../../../core/models/rating.model';

@Component({
  selector: 'app-agregar-gamificacion',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule
  ],
  templateUrl: './agregar-gamificacion.html',
  styleUrls: ['./agregar-gamificacion.scss']
})
export class AgregarGamificacionComponent implements OnInit {
  @Output() volver = new EventEmitter<void>();
  @Output() elementoCreado = new EventEmitter<RatingResponse>();
  
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
        console.log('Tipos de logros cargados:', this.tiposLogros);
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
        console.log('Usando tipos de logros por defecto:', this.tiposLogros);
      }
    });
  }

  // Método helper para obtener el label del ícono
  getIconLabel(iconValue: string): string {
    const icon = this.opcionesIconos.find(opt => opt.value === iconValue);
    return icon ? icon.label : '';
  }

  guardar() {
    if (this.formulario.valid) {
      const datos: RatingDTO = this.formulario.value;
      
      // Verificar si el código ya existe
      this.ratingService.checkCodeExists(datos.code).subscribe({
        next: (existe) => {
          if (existe) {
            alert('El código ya existe. Por favor use otro código.');
            return;
          }
          
          // Crear el elemento
          this.ratingService.create(datos).subscribe({
            next: (nuevo) => {
              this.elementoCreado.emit(nuevo);
              this.formulario.reset({ icono: '🏆' });
            },
            error: (error) => {
              console.error('Error creando gamificación:', error);
              alert('Error al crear la gamificación: ' + error.message);
            }
          });
        },
        error: (error) => console.error('Error verificando código:', error)
      });
    } else {
      this.marcarControlesComoTocados();
    }
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