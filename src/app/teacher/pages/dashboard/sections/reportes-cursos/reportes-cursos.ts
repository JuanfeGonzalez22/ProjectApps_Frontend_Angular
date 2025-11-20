import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { ReportService } from '../../../../../core/services/report.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Interfaces basadas en tu backend
interface InstructorReportDTO {
  instructorId: number;
  instructorName: string;
  assignedCourses: CourseSummaryDTO[];
}

interface CourseSummaryDTO {
  courseId: number;
  courseName: string;
  totalStudents: number;
  averageProgress: number;
  averageScore: number;
  completionRate: number;
}

interface GeneralReportDTO {
  id: number;
  userId: number;
  courseId?: number;
  title: string;
  description: string;
  date: string;
  updateDate: string;
}

@Component({
  selector: 'app-reportes-cursos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reportes-cursos.html',
  styleUrls: ['./reportes-cursos.scss']
})
export class ReportesCursos implements OnInit {
  // Datos del reporte del instructor
  instructorReport: InstructorReportDTO | null = null;
  
  // Lista de reportes generados
  misReportes: GeneralReportDTO[] = [];
  
  loading = true;
  error = '';
  activeTab = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.cargarDatosReportes();
  }

  cargarDatosReportes() {
    this.loading = true;
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      this.error = 'No se pudo obtener la información del usuario';
      this.loading = false;
      return;
    }

    // Cargar reporte del instructor
    this.reportService.generateInstructorReport(currentUser.id).subscribe({
      next: (reporte) => {
        this.instructorReport = reporte;
        this.cargarMisReportes(currentUser.id);
      },
      error: (err) => {
        console.error('❌ Error cargando reporte del instructor:', err);
        this.error = 'Error al generar el reporte del instructor';
        this.cargarMisReportes(currentUser.id); // Intentar cargar reportes aunque falle el de instructor
      }
    });
  }

  cargarMisReportes(userId: number) {
    this.reportService.getAllReports().subscribe({
      next: (reportes: any[]) => {
        // Filtrar reportes del usuario actual
        this.misReportes = reportes.filter(reporte => reporte.userId === userId);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error cargando reportes:', err);
        this.misReportes = [];
        this.loading = false;
      }
    });
  }

  generarNuevoReporte() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const nuevoReporte = {
      userId: currentUser.id,
      title: `Reporte Instructor - ${new Date().toLocaleDateString('es-ES')}`,
      description: 'Reporte generado automáticamente desde el panel del instructor'
    };

    this.reportService.createReport(nuevoReporte).subscribe({
      next: (reporteCreado) => {
        console.log('✅ Reporte creado:', reporteCreado);
        this.misReportes.unshift(reporteCreado as any);
        alert('✅ Reporte generado exitosamente');
      },
      error: (err) => {
        console.error('❌ Error creando reporte:', err);
        alert('❌ Error al generar el reporte');
      }
    });
  }

  descargarReporte(reporte: GeneralReportDTO) {
    console.log('📥 Descargando reporte:', reporte);
    alert(`⬇️ Descargando reporte: ${reporte.title}`);
  }

  private getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Métodos auxiliares para el template
  getTotalStudents(): number {
    if (!this.instructorReport) return 0;
    return this.instructorReport.assignedCourses.reduce((total, course) => total + course.totalStudents, 0);
  }

  getAverageProgress(): number {
    if (!this.instructorReport || this.instructorReport.assignedCourses.length === 0) return 0;
    const total = this.instructorReport.assignedCourses.reduce((sum, course) => sum + course.averageProgress, 0);
    return total / this.instructorReport.assignedCourses.length;
  }

  getAverageScore(): number {
    if (!this.instructorReport || this.instructorReport.assignedCourses.length === 0) return 0;
    const total = this.instructorReport.assignedCourses.reduce((sum, course) => sum + course.averageScore, 0);
    return total / this.instructorReport.assignedCourses.length;
  }
}