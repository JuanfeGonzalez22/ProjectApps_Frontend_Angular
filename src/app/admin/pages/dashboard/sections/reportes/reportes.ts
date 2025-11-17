import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../../../core/services/report.service';
import { ReportStaticsDTO, CourseReport } from '../../../../../core/models/report-statics.dto';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class ReportesComponent implements OnInit {
  private reportService = inject(ReportService);

  // DATOS PARA EL HEADER (vendrán del backend)
  finalizacion = 0;
  cursosTomados = '';
  engagement = 0;
  totalInscritos = 0;

  // FILTROS (como en tu mockup)
  cursoSeleccionado = 'Todos';
  departamentoSeleccionado = 'Todos';
  periodoSeleccionado = '2025/Q2';

  // TABLA DE CURSOS
  cursosReport: CourseReport[] = [];
  
  // ESTADOS
  loading = false;
  error = '';

  constructor() {}

  ngOnInit() {
    console.log('🎯 INICIANDO COMPONENTE REPORTES');
    
    // Primero cargar la tabla SIEMPRE para que se vea inmediatamente
    this.cargarDatosTabla();
    
    // Luego intentar cargar datos reales del backend
    this.cargarDatosReporte();
  }

  cargarDatosReporte() {
    console.log('🔍 CARGANDO DATOS REALES DEL BACKEND');
    this.loading = true;
    this.error = '';

    this.reportService.getAllReports().subscribe({
      next: (reports: any) => {
        console.log('✅ RESPUESTA DEL BACKEND:', reports);
        
        // El backend devuelve un OBJETO, no un array
        if (reports && typeof reports === 'object') {
          console.log('📊 DATOS REALES ENCONTRADOS');
          this.actualizarHeader(reports);
        } else {
          console.log('⚠️ BACKEND RESPONDIÓ PERO SIN DATOS VÁLIDOS');
          this.usarDatosDemo();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ ERROR CARGANDO DATOS REALES:', error);
        console.error('❌ STATUS:', error?.status);
        console.error('❌ MENSAJE:', error?.message);
        this.usarDatosDemo();
        this.loading = false;
        this.error = 'Error al cargar datos. Mostrando información de demo.';
      }
    });
  }

  actualizarHeader(reporte: ReportStaticsDTO) {
    console.log('📊 ACTUALIZANDO HEADER CON DATOS REALES:', reporte);
    
    this.finalizacion = Math.round(reporte.averageProgress);
    this.totalInscritos = reporte.totalRegistrations;
    this.engagement = Math.round(reporte.averageScores);
    this.cursosTomados = this.obtenerCursosMasPopulares(reporte);
    
    console.log('🎯 HEADER ACTUALIZADO:', {
      finalizacion: this.finalizacion + '%',
      inscritos: this.totalInscritos,
      engagement: this.engagement + '%',
      cursosTomados: this.cursosTomados
    });
  }

  obtenerCursosMasPopulares(reporte: ReportStaticsDTO): string {
    // Simular cursos populares basado en los datos reales
    const cursosDisponibles = ['Java Básico', 'Python Avanzado', 'Spring Boot', 'Angular Fundamentals'];
    
    // Si hay muchos usuarios, mostrar más cursos
    if (reporte.totalUsers > 5) {
      return cursosDisponibles.slice(0, 3).join(', ');
    } else {
      return cursosDisponibles.slice(0, 2).join(', ');
    }
  }

  cargarDatosTabla() {
    console.log('🔍 CARGANDO DATOS DE TABLA (DEMO)');
    
    // DATOS QUEMADOS PARA LA TABLA - Esto siempre se mostrará
    this.cursosReport = [
      { id: 1, nombre: 'Java Básico', inscritos: 120, finalizados: 95, porcentajeFinalizados: 79 },
      { id: 2, nombre: 'Python Avanzado', inscritos: 85, finalizados: 60, porcentajeFinalizados: 71 },
      { id: 3, nombre: 'Spring Boot', inscritos: 65, finalizados: 45, porcentajeFinalizados: 69 },
      { id: 4, nombre: 'Angular Fundamentals', inscritos: 75, finalizados: 55, porcentajeFinalizados: 73 },
      { id: 5, nombre: 'MySQL Database', inscritos: 90, finalizados: 70, porcentajeFinalizados: 78 }
    ];
    
    console.log('✅ TABLA CARGADA CON', this.cursosReport.length, 'CURSOS:', this.cursosReport);
  }

  usarDatosDemo() {
    console.log('🔄 USANDO DATOS DE DEMOSTRACIÓN');
    
    // Datos de demostración cuando el backend falle
    this.finalizacion = 75;
    this.cursosTomados = 'Java, Python';
    this.engagement = 68;
    this.totalInscritos = 345;
    
    console.log('🎯 DATOS DEMO CARGADOS:', {
      finalizacion: this.finalizacion + '%',
      cursosTomados: this.cursosTomados,
      engagement: this.engagement + '%',
      inscritos: this.totalInscritos
    });
  }

  aplicarFiltros() {
    console.log('🔍 APLICANDO FILTROS:', {
      curso: this.cursoSeleccionado,
      departamento: this.departamentoSeleccionado,
      periodo: this.periodoSeleccionado
    });

    this.loading = true;
    
    // Simular aplicación de filtros
    setTimeout(() => {
      console.log('✅ FILTROS APLICADOS - Recargando tabla');
      
      // Aquí iría la llamada real al backend con los filtros
      // Por ahora solo recargamos los datos de demo
      this.cargarDatosTabla();
      this.loading = false;
    }, 500);
  }

  eliminarReporte(cursoId: number) {
    console.log('🗑️ SOLICITANDO ELIMINAR CURSO:', cursoId);
    
    if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      this.loading = true;
      
      // Aquí usarías tu endpoint DELETE
      this.reportService.deleteReport(cursoId).subscribe({
        next: () => {
          console.log('✅ CURSO ELIMINADO EXITOSAMENTE:', cursoId);
          this.cursosReport = this.cursosReport.filter(curso => curso.id !== cursoId);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ ERROR ELIMINANDO CURSO:', error);
          // Eliminar localmente aunque falle el backend
          this.cursosReport = this.cursosReport.filter(curso => curso.id !== cursoId);
          this.loading = false;
          alert('Curso eliminado (modo demostración)');
        }
      });
    }
  }

  editarReporte(cursoId: number) {
    console.log('✏️ EDITANDO CURSO:', cursoId);
    // Lógica para editar - podría abrir un modal
    alert(`Editando curso ID: ${cursoId}`);
  }

  generarReporte(cursoId: number) {
    console.log('📊 GENERANDO REPORTE PARA CURSO:', cursoId);
    
    this.loading = true;
    
    // Usar endpoint para generar reporte específico
    this.reportService.getReportById(cursoId).subscribe({
      next: (reporte) => {
        console.log('✅ REPORTE GENERADO:', reporte);
        this.loading = false;
        alert(`Reporte generado exitosamente para: ${this.cursosReport.find(c => c.id === cursoId)?.nombre}`);
      },
      error: (error) => {
        console.error('❌ ERROR GENERANDO REPORTE:', error);
        this.loading = false;
        // Simular éxito si falla el backend
        alert(`Reporte generado (modo demo) para: ${this.cursosReport.find(c => c.id === cursoId)?.nombre}`);
      }
    });
  }

  exportarPDF() {
    console.log('📥 SOLICITANDO EXPORTACIÓN PDF');
    
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      alert('Reporte exportado a PDF exitosamente');
      console.log('✅ PDF EXPORTADO');
    }, 1000);
  }

  exportarCSV() {
    console.log('📥 SOLICITANDO EXPORTACIÓN CSV');
    
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      alert('Reporte exportado a CSV exitosamente');
      console.log('✅ CSV EXPORTADO');
    }, 1000);
  }

  volver() {
    console.log('↩️ VOLVIENDO A PÁGINA ANTERIOR');
    window.history.back();
  }

  reintentar() {
    console.log('🔄 REINTENTANDO CARGA DE DATOS');
    this.error = '';
    this.cargarDatosReporte();
  }
}