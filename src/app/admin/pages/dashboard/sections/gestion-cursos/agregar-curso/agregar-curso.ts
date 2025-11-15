import { Component, EventEmitter, Output } from '@angular/core';
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
  selector: 'app-agregar-curso',
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
  templateUrl: './agregar-curso.html',
  styleUrls: ['./agregar-curso.scss']
})
export class AgregarCursoComponent {

  @Output() volver = new EventEmitter<void>();
  @Output() cursoCreado = new EventEmitter<CourseData>();

  cursoForm: FormGroup;

  niveles = ['1', '2', '3'];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService    
  ) {
    this.cursoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      estimatedDuration: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)  
        ]
      ],
      level: ['', Validators.required]
    });
  }

  guardar() {
  if (this.cursoForm.valid) {
    const formValue = this.cursoForm.value;

    let duracion = formValue.estimatedDuration as string;

    // Si viene como "01:34", le añadimos los segundos → "01:34:00"
    if (duracion && duracion.length === 5) {
      duracion = duracion + ':00';
    }

    const course: CourseData = {
      ...formValue,
      estimatedDuration: duracion
    };

    console.log('📤 Enviando curso al backend:', course);

    this.courseService.create(course).subscribe({
      next: (nuevoCurso: CourseData) => {
        console.log('✅ Curso creado:', nuevoCurso);
        this.cursoCreado.emit(nuevoCurso);
        alert('Curso agregado correctamente');
        this.cursoForm.reset();
      },
      error: (e: any) => {
        console.error("❌ Error creando curso", e);
        alert("Error creando el curso");
      }
    });
  } else {
    alert('Por favor completa todos los campos obligatorios.');
  }
}

  cancelar() {
    this.volver.emit();
  }
}