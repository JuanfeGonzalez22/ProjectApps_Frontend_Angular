import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-editar-usuario',
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
  templateUrl: './editar-usuario.html',
  styleUrls: ['./editar-usuario.scss']
})
export class EditarUsuario {

  @Input() usuario: User | null = null;

  @Output() cancelar = new EventEmitter<void>();
  @Output() usuarioActualizado = new EventEmitter<User>();

  departamentos: string[] = [
    'Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá',
    'Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba',
    'Cundinamarca','Guainía','Guaviare','Huila','La Guajira','Magdalena',
    'Meta','Nariño','Norte de Santander','Putumayo','Quindío','Risaralda',
    'San Andrés y Providencia','Santander','Sucre','Tolima','Valle del Cauca',
    'Vaupés','Vichada'
  ];

  // Campos editables
  fullName: string = '';
  email: string = '';
  department: string = '';
  role: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.usuario) {
      this.fullName = this.usuario.fullName;
      this.email = this.usuario.email;
      this.department = this.usuario.department;
      this.role = this.usuario.role;
    }
  }

  guardar() {
    if(!this.usuario) return;
    
    const actualizado: User = {
      ...this.usuario,
      fullName: this.fullName,
      email: this.email,
      department: this.department,
      role: this.role,
      password: this.usuario.password // No se edita
    };

    this.userService.update(this.usuario.id, actualizado).subscribe({
      next: (u) => {
        alert('Usuario actualizado correctamente.');
        this.usuarioActualizado.emit(u);
      },
      error: (err) => {
        console.error('❌ Error al actualizar usuario:', err);
        alert('Error al actualizar usuario.');
      }
    });
  }

}
