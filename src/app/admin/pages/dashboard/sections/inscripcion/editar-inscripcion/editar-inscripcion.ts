// src/app/admin/pages/dashboard/sections/inscripciones/editar-inscripcion/editar-inscripcion.ts
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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
  selector: 'app-editar-inscripcion',
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
  templateUrl: './editar-inscripcion.html',
  styleUrls: ['./editar-inscripcion.scss']
})
export class EditarInscripcionComponent implements OnInit {

  @Input() inscripcion!: RegistrationResponse;
  @Output() cancelar = new EventEmitter<void>();
  @Output() inscripcionActualizada = new EventEmitter<RegistrationResponse>();

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

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarCursos();
    
    // ✅ Cargar datos después de que los combos estén listos
    setTimeout(() => {
      if (this.inscripcion) {
        this.inscripcionForm.patchValue({
          userId: this.inscripcion.userId.toString(),
          courseId: this.inscripcion.courseId.toString(),
          status: this.inscripcion.status
        });
      }
    }, 100);
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
    if (this.inscripcionForm.valid && this.inscripcion) {
      const formValue = this.inscripcionForm.value;

      const inscripcion: RegistrationDTO = {
        userId: Number(formValue.userId),     // ← Convertir a number
        courseId: Number(formValue.courseId), // ← Convertir a number
        status: formValue.status
      };

      console.log('📤 Actualizando inscripción:', this.inscripcion.id, inscripcion);

      this.registrationService.update(this.inscripcion.id, inscripcion).subscribe({
        next: (inscripcionActualizada: RegistrationDTO) => {
          console.log('✅ Inscripción actualizada:', inscripcionActualizada);
          
          // Crear objeto actualizado para emitir
          const respuestaActualizada: RegistrationResponse = {
            ...this.inscripcion,
            ...inscripcionActualizada,
            // ✅ Mantener la información de usuario y curso
            userName: this.obtenerNombreUsuario(Number(formValue.userId)),
            courseTitle: this.obtenerTituloCurso(Number(formValue.courseId))
          };
          
          this.inscripcionActualizada.emit(respuestaActualizada);
          alert('Inscripción actualizada correctamente');
        },
        error: (e: any) => {
          console.error("❌ Error actualizando inscripción", e);
          alert("Error actualizando la inscripción");
        }
      });
    } else {
      alert('Por favor completa todos los campos obligatorios.');
    }
  }

  // ✅ NUEVO: Obtener nombre de usuario para la respuesta
  private obtenerNombreUsuario(userId: number): string {
    const usuario = this.usuarios.find(u => u.id === userId);
    return usuario ? (usuario.name || usuario.fullName || 'Usuario') : 'Usuario';
  }

  // ✅ NUEVO: Obtener título del curso para la respuesta
  private obtenerTituloCurso(courseId: number): string {
    const curso = this.cursos.find(c => c.id === courseId);
    return curso ? curso.title : 'Curso';
  }

  onCancelar() {
    this.cancelar.emit();
  }
}