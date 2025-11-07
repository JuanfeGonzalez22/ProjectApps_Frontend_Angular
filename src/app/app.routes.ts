import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },

  { path: 'admin', loadComponent: () => import('./admin/pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'teacher', loadComponent: () => import('./teacher/pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'student', loadComponent: () => import('./student/pages/dashboard/dashboard').then(m => m.Dashboard) },

  { path: '**', redirectTo: 'auth/login' }
];
