import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../../core/models/user.model';
import { UserService } from '../../../../../core/services/user.service';
import { EditarUsuario } from './editar-usuario/editar-usuario';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    EditarUsuario,
    CrearUsuarioComponent
  ],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss']
})
export class Usuarios {
  usuarios: User[] = [];
  usuariosFiltrados: User[] = [];
  section: string = 'usuarios';
  
  usuarioSeleccionado: User | null = null;
  vista: 'tabla' | 'editar' | 'crear' = 'tabla';
  terminoBusqueda: string = '';

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
        this.usuariosFiltrados = data;
      },
      error: (err) => console.error('❌ Error cargando usuarios:', err)
    });
  }

  // En usuarios.ts - REEMPLAZA el método filtrarUsuarios
// En usuarios.ts - MODIFICAR filtrarUsuarios
async filtrarUsuarios() {
  if (!this.terminoBusqueda?.trim()) {
    this.usuariosFiltrados = this.usuarios;
    return;
  }

  const termino = this.terminoBusqueda.trim();
  
  // Si es un número, buscar por ID específico
  if (!isNaN(Number(termino))) {
    const id = Number(termino);
    try {
      const usuario = await this.userService.getById(id).toPromise();
      this.usuariosFiltrados = usuario ? [usuario] : [];
    } catch (error) {
      this.usuariosFiltrados = []; // Usuario no encontrado
    }
  } else {
    // Si no es número, buscar en los otros campos localmente
    const terminoLower = termino.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      (usuario.fullName?.toLowerCase() || '').includes(terminoLower) ||
      (usuario.email?.toLowerCase() || '').includes(terminoLower) ||
      (usuario.department?.toLowerCase() || '').includes(terminoLower) ||
      (usuario.role?.toLowerCase() || '').includes(terminoLower)
    );
  }
  }


  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.filtrarUsuarios();
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

  // NUEVO MÉTODO: Para abrir creación
  crearUsuario() {
    this.vista = 'crear';
  }

  onUsuarioActualizado(usuario: User) {
    this.usuarios = this.usuarios.map(u =>
      u.id === usuario.id ? usuario : u
    );
    this.vista = 'tabla';
  }

  onUsuarioCreado(usuario: any) {
    this.usuarios.push(usuario);
    this.vista = 'tabla';
    this.cargarUsuarios();
  }
}