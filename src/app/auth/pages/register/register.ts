import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../services/auth';
import { Router } from '@angular/router';

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
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar() {
    // ✅ Validación básica
    if (!this.nombre || !this.email || !this.password || !this.role || !this.selectedDepto) {
      this.errorMsg = 'Por favor completa todos los campos';
      return;
    }

    const userData: RegisterRequest = {
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
        alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');

        // Opción 1: Cerrar el modal de registro y volver al login
        this.cerrarRegistro.emit();

        // Opción 2: Redirigir automáticamente al dashboard según el rol
        // if (response.user) {
        //   switch (response.user.role?.toUpperCase()) {
        //     case 'ADMIN':
        //       this.router.navigate(['/admin']);
        //       break;
        //     case 'INSTRUCTOR':
        //       this.router.navigate(['/teacher']);
        //       break;
        //     case 'STUDENT':
        //     case 'APRENDIZ':
        //       this.router.navigate(['/student']);
        //       break;
        //   }
        // }
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);

        if (err.error && err.error.message) {
          this.errorMsg = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          this.errorMsg = err.error;
        } else {
          this.errorMsg = 'Error al registrar el usuario. Revisa los datos.';
        }

        alert(this.errorMsg);
      }
    });
  }
}
