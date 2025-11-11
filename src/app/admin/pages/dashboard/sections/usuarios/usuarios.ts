import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../../../../core/models/user.model';
import { UserService } from '../../../../../core/services/user.service';


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
  usuarios: User[] = [];
  section: string = 'usuarios';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
  console.log('📡 Ejecutando getAll()...');
  this.userService.getAll().subscribe({
    next: (data) => {
      console.log('✅ Datos recibidos del backend:', data);
      this.usuarios = data;
    },
    error: (err) => console.error('❌ Error cargando usuarios:', err)
  });
}


  setSection(seccion: string) {
    this.section = seccion;
  }

  volver() {
    history.back();
  }
}
