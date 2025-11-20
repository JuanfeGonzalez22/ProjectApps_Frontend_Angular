// src/app/admin/pages/dashboard/sections/asignacion-instructores/asignar-instructor/asignar-instructor.ts
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; 
import { CourseInstructorServiceAsig } from '../../../../../../core/services/course-instructor-asig.service';
import { CourseInstructorResponse, CourseInstructorDTO } from '../../../../../../core/models/course-instructor.model';

@Component({
  selector: 'app-asignar-instructor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule, 
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './asignar-instructor.html',
  styleUrls: ['./asignar-instructor.scss']
})
export class AsignarInstructorComponent implements OnInit {

  @Input() instructores: any[] = [];
  @Input() cursosDisponibles: any[] = [];
  @Output() volver = new EventEmitter<void>();
  @Output() asignacionCreada = new EventEmitter<CourseInstructorResponse>();

  asignacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private courseInstructorServiceAsig: CourseInstructorServiceAsig    
  ) {
    this.asignacionForm = this.fb.group({
      instructorId: ['', Validators.required],
      courseId: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('👥 Instructores recibidos:', this.instructores);
    console.log('📚 Cursos disponibles recibidos:', this.cursosDisponibles);
  }

  guardar() {
    if (this.asignacionForm.valid) {
      const formValue = this.asignacionForm.value;

      const asignacion: CourseInstructorDTO = {
        instructorId: Number(formValue.instructorId),
        courseId: Number(formValue.courseId)
      };

      console.log('📤 Enviando asignación al backend:', asignacion);

      this.courseInstructorServiceAsig.createAssignment(asignacion).subscribe({
        next: (nuevaAsignacion: CourseInstructorResponse) => {
          console.log('✅ Asignación creada:', nuevaAsignacion);
          this.asignacionCreada.emit(nuevaAsignacion);
          alert('Instructor asignado al curso correctamente ✅');
          this.asignacionForm.reset();
        },
        error: (e: any) => {
          console.error("❌ Error creando asignación", e);
          
          if (e.status === 400) {
            alert("Error: Datos inválidos o el instructor ya está asignado a este curso");
          } else {
            alert("Error asignando el instructor al curso");
          }
        }
      });
    } else {
      alert('Por favor selecciona un instructor y un curso.');
    }
  }

  cancelar() {
    this.volver.emit();
  }

  // ✅ Obtener nombre del instructor seleccionado
  get instructorSeleccionado(): string {
    const instructorId = this.asignacionForm.get('instructorId')?.value;
    const instructor = this.instructores.find(i => i.id == instructorId);
    return instructor ? (instructor.name || instructor.fullName) : '';
  }

  // ✅ Obtener nombre del curso seleccionado
  get cursoSeleccionado(): string {
    const courseId = this.asignacionForm.get('courseId')?.value;
    const curso = this.cursosDisponibles.find(c => c.id == courseId);
    return curso ? curso.title : '';
  }
}