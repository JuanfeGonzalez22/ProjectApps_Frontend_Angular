import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  @Output() cerrarRegistro = new EventEmitter<void>();
  
  departamentos: string[] = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
    'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
    'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
    'Vaupés', 'Vichada'
  ];

  nombre = '';
  email = '';
  password = '';
  role = '';
  selectedDepto = '';

  constructor(private authService: AuthService) {}

  registrar() {
  const userData = {
    name: this.nombre,
    email: this.email,
    password: this.password,
    department: this.selectedDepto,
    role: this.role
  };




    console.log('📤 Enviando datos de registro:', userData);
  this.authService.register(userData).subscribe({
    next: (response) => {
      console.log('✅ Registro exitoso:', response);
      alert('Usuario registrado correctamente.');
      this.cerrarRegistro.emit();
    },
    error: (err) => {
      console.error('❌ Error al registrar:', err);
      alert('Error al registrar el usuario. Revisa los datos.');
    }
  });
  }
}
