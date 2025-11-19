import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { User } from '../../../../../../core/models/user.model';
import { UserService } from '../../../../../../core/services/user.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './crear-usuario.html',
  styleUrls: ['./crear-usuario.scss']
})
export class CrearUsuarioComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Output() usuarioCreado = new EventEmitter<User>();

  departamentos: string[] = [
    'Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá',
    'Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba',
    'Cundinamarca','Guainía','Guaviare','Huila','La Guajira','Magdalena',
    'Meta','Nariño','Norte de Santander','Putumayo','Quindío','Risaralda',
    'San Andrés y Providencia','Santander','Sucre','Tolima','Valle del Cauca',
    'Vaupés','Vichada'
  ];

  // Campos para nuevo usuario
  fullName: string = '';
  email: string = '';
  password: string = '';
  department: string = '';
  role: string = 'USER';

  private userService: UserService = inject(UserService);

  guardar() {
    // Validaciones básicas
    if (!this.fullName || !this.email || !this.password) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const nuevoUsuario: Partial<User> = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      department: this.department,
      role: this.role
    };

    this.userService.create(nuevoUsuario).subscribe({
      next: (usuarioCreado: User) => {
        alert('Usuario creado correctamente!');
        this.usuarioCreado.emit(usuarioCreado);
      },
      error: (err: any) => {
        console.error(' Error al crear usuario:', err);
        alert('Error al crear usuario: ' + (err.error?.message || err.message));
      }
    });
  }
}
