import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../../../../core/models/user.model';
import { UserService } from '../../../../../core/services/user.service';
import { EditarUsuario } from './editar-usuario/editar-usuario';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    EditarUsuario
  ],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss']
})
export class Usuarios {
  usuarios: User[] = [];
  section: string = 'usuarios';
  
  usuarioSeleccionado: User | null = null;
  vista: 'tabla' | 'editar' = 'tabla';


  constructor(private userService: UserService) {}

  ngOnInit() {
    this.section = 'usuarios';
    this.vista = 'tabla';
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

  seleccionarUsuario(usuario: User) {
    this.usuarioSeleccionado = usuario;
  }

  editarUsuario() {
    if (!this.usuarioSeleccionado) {
      alert('Selecciona un usuario primero.');
      return;
    }
    this.vista = 'editar';
  }

  onUsuarioActualizado(usuario: User) {
    this.usuarios = this.usuarios.map(u =>
      u.id === usuario.id ? usuario : u
    );
    this.vista = 'tabla';
  }


}
