import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Register } from "../register/register";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Register],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';
  mostrarRegistro = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  abrirRegistro(){
    this.mostrarRegistro = true;
    console.log("Registro abierto");
  }

  cerrarRegistro(){
    this.mostrarRegistro = false;
    console.log("Registro cerrado");
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMsg = 'Por favor llena todos los campos correctamente.';
      return;
    }

    console.log(' Enviando login:', this.loginForm.value);

    this.auth.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Respuesta completa del backend:', response);

        const user = response.user;
        const token = response.token;

        console.log(' Usuario:', user);
        console.log('Token:', token);

        if (user && token) {
          console.log('💾 Datos guardados en localStorage');
          console.log('Role del usuario:', user.role);


          switch (user.role?.toUpperCase()) {
            case 'ADMIN':
              console.log(' Redirigiendo a ADMIN');
              this.router.navigate(['/admin']);
              break;
            case 'INSTRUCTOR':
            case 'TEACHER':
              console.log(' Redirigiendo a TEACHER');
              this.router.navigate(['/teacher']);
              break;
            case 'STUDENT':
            case 'APRENDIZ':
            case 'USER':
              console.log(' Redirigiendo a STUDENT');
              this.router.navigate(['/student']);
              break;
            default:
              console.log(' Rol no reconocido:', user.role);
              this.router.navigate(['/']);
              break;
          }
        } else {
          console.error(' Respuesta incompleta:', response);
          this.errorMsg = 'Error en la respuesta del servidor';
        }
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.errorMsg = 'Credenciales inválidas o usuario no encontrado.';

        if (err.error?.message) {
          this.errorMsg = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          this.errorMsg = err.error;
        }
      }
    });
  }
}
