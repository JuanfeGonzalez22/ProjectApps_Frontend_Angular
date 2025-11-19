import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CourseService } from '../../../../../core/services/course.service';
import { AgregarCursoComponent } from '../gestion-cursos/agregar-curso/agregar-curso';
import { CourseData } from '../../../../../core/models/course.model';
@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    AgregarCursoComponent
  ],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.scss']
})
export class Cursos {

  vista: 'grid' | 'form' = 'grid';

  cursos: CourseData[] = [];

  constructor(private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCursos();
  }

  cargarCursos() {
  this.courseService.getAll().subscribe({
    next: (data) => {
      console.log('📚 Cursos desde el backend:', data);
      this.cursos = data;   // ✅ Nada de curso ejemplo
    },
    error: (err) => console.error('Error cargando cursos:', err)
  });
}

  abrirFormulario() {
    this.vista = 'form';
  }

  cerrarFormulario() {
    this.vista = 'grid';
  }


  agregarCursoALista(curso: CourseData) {
    this.cursos = [...this.cursos, curso];
    this.vista = 'grid';
  }
}
