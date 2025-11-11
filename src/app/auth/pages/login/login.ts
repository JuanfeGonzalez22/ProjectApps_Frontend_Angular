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

    
    this.auth.login(this.loginForm.value).subscribe({
      next: (user) => {
        console.log('✅ Login correcto:', user);
        localStorage.setItem('user', JSON.stringify(user));

        
        switch (user.role?.toUpperCase()) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'TEACHER':
            this.router.navigate(['/teacher']);
            break;
          case 'STUDENT':
            this.router.navigate(['/student']);
            break;
          default:
            this.router.navigate(['/']); 
            break;
        }
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.errorMsg = 'Credenciales inválidas o usuario no encontrado.';
      }
    });
  }
}
