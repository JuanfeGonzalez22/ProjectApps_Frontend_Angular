import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ModuleService } from '../../../../../../core/services/module.service';
import { CourseService } from '../../../../../../core/services/course.service';
import { ModuleData } from '../../../../../../core/models/module.model';
import { CourseData } from '../../../../../../core/models/course.model';

@Component({
  selector: 'app-agregar-modulo',
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
  templateUrl: './agregar-modulo.html',
  styleUrls: ['./agregar-modulo.scss']
})
export class AgregarModuloComponent implements OnInit {
  @Output() volver = new EventEmitter<void>();
  @Output() moduloCreado = new EventEmitter<ModuleData>();

  moduloForm: FormGroup;
  tipos = ['video', 'texto', 'quiz', 'practica'];
  cursos: CourseData[] = []; // ✅ Lista de cursos disponibles

  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private courseService: CourseService // ✅ Servicio de cursos
  ) {
    this.moduloForm = this.fb.group({
      courseId: ['', Validators.required], // ✅ Ahora es un select, no input
      title: ['', Validators.required],
      type: ['', Validators.required],
      order: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.courseService.getAll().subscribe({
      next: (cursos: CourseData[]) => {
        this.cursos = cursos;
        console.log('📚 Cursos cargados:', this.cursos);
      },
      error: (err) => {
        console.error('❌ Error cargando cursos:', err);
        alert('Error al cargar la lista de cursos');
      }
    });
  }

  guardar() {
    if (this.moduloForm.valid) {
      const modulo: ModuleData = this.moduloForm.value;

      console.log('📤 Enviando módulo al backend:', modulo);

      this.moduleService.create(modulo).subscribe({
        next: (nuevoModulo: ModuleData) => {
          console.log('✅ Módulo creado:', nuevoModulo);
          this.moduloCreado.emit(nuevoModulo);
          alert('Módulo agregado correctamente');
          this.moduloForm.reset();
        },
        error: (e: any) => {
          console.error("❌ Error creando módulo", e);
          alert("Error creando el módulo: " + (e.error?.message || e.message));
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