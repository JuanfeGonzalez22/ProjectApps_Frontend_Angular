import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CourseService } from '../../../../../../core/services/course.service';
import { CourseData } from '../../../../../../core/models/course.model';

@Component({
  selector: 'app-editar-curso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './editar-curso.html',
  styleUrls: ['./editar-curso.scss']
})
export class EditarCursoComponent implements OnChanges {

  @Input() curso: CourseData | null = null;

  @Output() cancelar = new EventEmitter<void>();
  @Output() cursoActualizado = new EventEmitter<CourseData>();

  cursoForm: FormGroup;

  niveles = ['1', '2', '3']; // Básico, Intermedio, Avanzado

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    this.cursoForm = this.fb.group({
      id: [{ value: '', disabled: true }],   // ID solo lectura
      title: ['', Validators.required],
      description: ['', Validators.required],
      estimatedDuration: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)  // HH:mm
        ]
      ],
      level: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['curso'] && this.curso) {

      // Convertir "HH:mm:ss" → "HH:mm" para el input
      let duracion = this.curso.estimatedDuration || '';
      if (duracion.length === 8) { // "HH:mm:ss"
        duracion = duracion.substring(0, 5);
      }

      this.cursoForm.patchValue({
        id: this.curso.id,
        title: this.curso.title,
        description: this.curso.description,
        estimatedDuration: duracion,
        level: this.curso.level?.toString()
      });
    }
  }

  guardar() {
    if (this.cursoForm.invalid || !this.curso) return;

    const raw = this.cursoForm.getRawValue();

    let duracion = raw.estimatedDuration as string;
    if (duracion.length === 5) {
      duracion = duracion + ':00'; // HH:mm → HH:mm:ss
    }

    const actualizado: CourseData = {
      id: this.curso.id,
      title: raw.title,
      description: raw.description,
      estimatedDuration: duracion,
      level: parseInt(raw.level, 10)
    };

    this.courseService.update(actualizado.id!, actualizado).subscribe({
      next: (cursoBack) => {
        this.cursoActualizado.emit(cursoBack);
        alert('Curso actualizado correctamente');
      },
      error: (e) => {
        console.error('❌ Error actualizando curso', e);
        alert('Ocurrió un error al actualizar el curso');
      }
    });
  }

  onCancelar() {
    this.cancelar.emit();
  }
}