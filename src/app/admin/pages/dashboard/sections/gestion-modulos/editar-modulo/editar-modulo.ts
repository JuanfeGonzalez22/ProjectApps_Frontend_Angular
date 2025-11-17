import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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
  selector: 'app-editar-modulo',
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
  templateUrl: './editar-modulo.html',
  styleUrls: ['./editar-modulo.scss']
})
export class EditarModuloComponent implements OnInit {
  @Input() modulo!: ModuleData;
  @Output() volver = new EventEmitter<void>();
  @Output() moduloActualizado = new EventEmitter<ModuleData>();

  moduloForm: FormGroup;
  tipos = ['video', 'texto', 'quiz', 'practica'];
  cursos: CourseData[] = []; // ✅ Lista de cursos

  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private courseService: CourseService // ✅ Servicio de cursos
  ) {
    this.moduloForm = this.fb.group({
      courseId: ['', Validators.required], // ✅ Ahora es select
      title: ['', Validators.required],
      type: ['', Validators.required],
      order: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarCursos();
    
    if (this.modulo) {
      // Esperar a que los cursos se carguen para setear el valor
      setTimeout(() => {
        this.moduloForm.patchValue({
          courseId: this.modulo.courseId,
          title: this.modulo.title,
          type: this.modulo.type,
          order: this.modulo.order
        });
      }, 100);
    }
  }

  cargarCursos(): void {
    this.courseService.getAll().subscribe({
      next: (cursos: CourseData[]) => {
        this.cursos = cursos;
      },
      error: (err) => {
        console.error('❌ Error cargando cursos:', err);
      }
    });
  }

  guardar() {
    if (this.moduloForm.valid && this.modulo.id) {
      const moduloActualizado: ModuleData = {
        ...this.moduloForm.value,
        id: this.modulo.id
      };

      console.log('📤 Actualizando módulo:', moduloActualizado);

      this.moduleService.update(this.modulo.id, moduloActualizado).subscribe({
        next: (modulo: ModuleData) => {
          console.log('✅ Módulo actualizado:', modulo);
          this.moduloActualizado.emit(modulo);
          alert('Módulo actualizado correctamente');
        },
        error: (e: any) => {
          console.error("❌ Error actualizando módulo", e);
          alert("Error actualizando el módulo: " + (e.error?.message || e.message));
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