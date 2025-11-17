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
    console.log("✅ Registro abierto");
  }

  cerrarRegistro(){
    this.mostrarRegistro = false;
    console.log("❌ Registro cerrado");
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMsg = 'Por favor llena todos los campos correctamente.';
      return;
    }

    console.log('📤 Enviando login:', this.loginForm.value);
    
    this.auth.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta completa del backend:', response);
        
        // ✅ CORRECCIÓN: El backend ahora devuelve {token, user, message}
        const user = response.user; // ← Acceder al user dentro de la respuesta
        const token = response.token; // ← Obtener el token
        
        console.log('👤 Usuario:', user);
        console.log('🔐 Token:', token);
        
        if (user && token) {
          // Guardar en localStorage (el AuthService ya lo hace, pero por si acaso)
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          
          console.log('💾 Datos guardados en localStorage');
          console.log('Role del usuario:', user.role);
          
          // Redirigir según el rol
          switch (user.role?.toUpperCase()) {
            case 'ADMIN':
              console.log('🎯 Redirigiendo a ADMIN');
              this.router.navigate(['/admin']);
              break;
            case 'INSTRUCTOR': // ← Asegúrate que coincida con tu backend
            case 'TEACHER':
              console.log('🎯 Redirigiendo a TEACHER');
              this.router.navigate(['/teacher']);
              break;
            case 'STUDENT':
            case 'USER':
              console.log('🎯 Redirigiendo a STUDENT');
              this.router.navigate(['/student']);
              break;
            default:
              console.log('⚠️ Rol no reconocido, redirigiendo a home');
              this.router.navigate(['/']);
              break;
          }
        } else {
          console.error('❌ Respuesta incompleta:', response);
          this.errorMsg = 'Error en la respuesta del servidor';
        }
      },
      error: (err) => {
        console.error('❌ Error de login:', err);
        this.errorMsg = 'Credenciales inválidas o usuario no encontrado.';
        
        // Mostrar más detalles del error
        if (err.error && err.error.error) {
          this.errorMsg += ' - ' + err.error.error;
        }
      }
    });
  }
}