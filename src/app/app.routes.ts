// import { Routes } from '@angular/router';
// import { LoginComponent } from './auth/pages/login/login';

// export const routes: Routes = [
//   { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
//   { path: 'auth/login', component: LoginComponent },

//   { path: 'admin', loadComponent: () => import('./admin/pages/dashboard/dashboard').then(m => m.Dashboard), 
//     children: [
//       {
//         path: 'modulos',
//         loadComponent: () =>
//         import('./admin/pages/dashboard/sections/gestion-modulos/gestion-modulos')
//           .then(c => c.GestionModulos)
//       },
//       {
//         path: 'cursos',
//         loadComponent: () =>
//         import('./admin/pages/dashboard/sections/gestion-cursos/gestion-cursos')
//           .then(c => c.GestionCursos)
//       },

      
//     ]
//   },
//   { path: 'teacher', loadComponent: () => import('./teacher/pages/dashboard/dashboard').then(m => m.Dashboard) },
//   { path: 'student', loadComponent: () => import('./student/pages/dashboard/dashboard').then(m => m.Dashboard) },

//   { path: '**', redirectTo: 'auth/login' }
// ];

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