// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import{provideAnimations}from'@angular/platform-browser/animations';
import { LoginComponent } from './auth/pages/login/login';
import { HttpClientModule } from '@angular/common/http';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },

  { path: 'admin', loadComponent: () => import('./admin/pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'teacher', loadComponent: () => import('./teacher/pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'student', loadComponent: () => import('./student/pages/dashboard/dashboard').then(m => m.Dashboard) },

  { path: '**', redirectTo: 'auth/login' }  
];

export const appConfig: ApplicationConfig = {
  providers: [
   [provideHttpClient()],
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
