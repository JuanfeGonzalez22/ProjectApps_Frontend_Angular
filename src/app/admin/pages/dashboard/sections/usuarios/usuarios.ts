import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss']
})
export class Usuarios {
  usuarios = [
    { id: 1, nombre: 'Andrés Gómez', email: 'andres@mail.com', rol: 'Admin', departamento: 'TI' },
  ];
  section: string = 'usuarios';
  volver() {
    history.back(); 
  }

  setSection(seccion: string) {
    this.section = seccion;
  }
}
