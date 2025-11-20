// src/app/admin/pages/dashboard/sections/inscripciones/agregar-inscripcion/agregar-inscripcion.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RegistrationService } from '../../../../../../core/services/registration.service';
import { UserService } from '../../../../../../core/services/user.service';
import { CourseService } from '../../../../../../core/services/course.service';
import { RegistrationResponse, RegistrationDTO } from '../../../../../../core/models/registration.model';

@Component({
  selector: 'app-agregar-inscripcion',
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
  templateUrl: './agregar-inscripcion.html',
  styleUrls: ['./agregar-inscripcion.scss']
})
export class AgregarInscripcionComponent implements OnInit {

  @Output() volver = new EventEmitter<void>();
  @Output() inscripcionCreada = new EventEmitter<RegistrationResponse>();

  inscripcionForm: FormGroup;

  // ✅ NUEVO: Arrays para combos
  usuarios: any[] = [];
  cursos: any[] = [];
  estados = ['ACTIVO', 'COMPLETADO', 'RETIRADO'];

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private userService: UserService,          // ✅ NUEVO
    private courseService: CourseService       // ✅ NUEVO
  ) {
    this.inscripcionForm = this.fb.group({
      userId: ['', Validators.required],      // ← Cambiado a string
      courseId: ['', Validators.required],    // ← Cambiado a string  
      status: ['ACTIVO', Validators.required]
    });
  }

  // ✅ NUEVO: Cargar datos al inicializar
  ngOnInit() {
    this.cargarUsuarios();
    this.cargarCursos();
  }

  // ✅ NUEVO: Cargar usuarios
  cargarUsuarios() {
    this.userService.getAllUsers().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        console.log('👥 Usuarios cargados:', this.usuarios);
      },
      error: (error) => {
        console.error('❌ Error cargando usuarios:', error);
        alert('Error al cargar la lista de usuarios');
      }
    });
  }

  // ✅ NUEVO: Cargar cursos
  cargarCursos() {
    this.courseService.getAllCourses().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        console.log('📚 Cursos cargados:', this.cursos);
      },
      error: (error) => {
        console.error('❌ Error cargando cursos:', error);
        alert('Error al cargar la lista de cursos');
      }
    });
  }

  guardar() {
    if (this.inscripcionForm.valid) {
      const formValue = this.inscripcionForm.value;

      const inscripcion: RegistrationDTO = {
        userId: Number(formValue.userId),     // ← Convertir a number
        courseId: Number(formValue.courseId), // ← Convertir a number
        status: formValue.status
      };

      console.log('📤 Enviando inscripción al backend:', inscripcion);

      this.registrationService.create(inscripcion).subscribe({
        next: (nuevaInscripcion: RegistrationResponse) => {
          console.log('✅ Inscripción creada:', nuevaInscripcion);
          this.inscripcionCreada.emit(nuevaInscripcion);
          alert('Inscripción creada correctamente');
          this.inscripcionForm.reset({ status: 'ACTIVO' });
        },
        error: (e: any) => {
          console.error("❌ Error creando inscripción", e);
          alert("Error creando la inscripción");
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