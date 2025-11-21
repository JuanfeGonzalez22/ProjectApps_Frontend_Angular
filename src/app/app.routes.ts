// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login';
import { roleGuard } from './core/guard/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },

  // ✅ RUTAS DE ADMIN - Solo para rol ADMIN
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'modulos',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/gestion-modulos/gestion-modulos')
            .then(c => c.GestionModulos)
      },
      {
        path: 'cursos',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/gestion-cursos/gestion-cursos')
            .then(c => c.GestionCursos)
      },
      {
        path: 'inscripciones',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/inscripcion/gestion-inscripciones')
            .then(c => c.GestionInscripciones)
      },
      // ✅ NUEVA RUTA: GAMIFICACIÓN
      {
        path: 'gamificacion',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/gamificacion/gestion-gamificacion')
            .then(c => c.GestionGamificacion)
      },
      // ✅ Puedes agregar también las otras rutas que tienes en el dashboard
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/usuarios/usuarios')
            .then(c => c.Usuarios)
      },
      {
        path: 'cursos-catalogo',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/cursos/cursos')
            .then(c => c.Cursos)
      },
      {
        path: 'asignacion-instructores',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/asignacion-instructores/gestion-asignacion-instructores')
            .then(c => c.GestionAsignacionInstructores)
      },
      {
        path: 'gestion-evaluaciones',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/gestion-evaluaciones/gestion-evaluaciones')
            .then(c => c.GestionEvaluaciones)
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/reportes/reportes')
            .then(c => c.ReportesComponent)
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./admin/pages/dashboard/sections/configuracion/configuracion')
            .then(c => c.Configuracion)
      }
    ]
  },

  // ✅ RUTAS DE TEACHER - Solo para rol TEACHER
  { 
    path: 'teacher', 
    loadComponent: () => import('./teacher/pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [roleGuard],
    data: { roles: ['TEACHER'] }
  },

  // ✅ RUTAS DE STUDENT - Solo para rol STUDENT
  { 
    path: 'student', 
    loadComponent: () => import('./student/pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [roleGuard],
    data: { roles: ['STUDENT'] }
  },

  { path: '**', redirectTo: 'auth/login' }
];