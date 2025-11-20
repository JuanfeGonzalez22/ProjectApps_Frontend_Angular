import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnswerService, AnswerResponseDTO, GradeAnswerDTO } from '../../../../../core/services/answer.service';
import { GradeDialogComponent } from '../calificar-evaluaciones/grade-dialog/grade-dialog';

@Component({
  selector: 'app-calificar-evaluaciones',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './calificar-evaluaciones.html',
  styleUrls: ['./calificar-evaluaciones.scss']
})
export class CalificarEvaluaciones implements OnInit {
  respuestasPendientes: AnswerResponseDTO[] = [];
  respuestasFiltradas: AnswerResponseDTO[] = [];
  loading = true;
  error = '';
  filtroEstado = 'pendientes';

  constructor(
    private answerService: AnswerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarRespuestasPendientes();
  }

  cargarRespuestasPendientes() {
    this.loading = true;
    this.answerService.getPendingAnswers().subscribe({
      next: (respuestas) => {
        console.log('📝 Respuestas pendientes del backend:', respuestas);
        this.respuestasPendientes = respuestas;
        this.respuestasFiltradas = respuestas;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error cargando respuestas:', err);
        this.error = 'Error al cargar las evaluaciones pendientes';
        this.loading = false;
        this.respuestasPendientes = [];
        this.respuestasFiltradas = [];
      }
    });
  }

  calificarRespuesta(respuesta: AnswerResponseDTO) {
    const dialogRef = this.dialog.open(GradeDialogComponent, {
      width: '500px',
      data: { 
        respuesta: respuesta,
        maxScore: 100
      }
    });

    dialogRef.afterClosed().subscribe((result: GradeAnswerDTO) => {
      if (result) {
        console.log('🎯 Calificando respuesta:', respuesta.id, 'con:', result);
        this.answerService.gradeAnswer(respuesta.id, result).subscribe({
          next: (respuestaCalificada) => {
            console.log('✅ Respuesta calificada:', respuestaCalificada);
            // Remover la respuesta calificada de la lista
            this.respuestasPendientes = this.respuestasPendientes.filter(
              r => r.id !== respuesta.id
            );
            this.aplicarFiltros();
          },
          error: (err) => {
            console.error('❌ Error calificando respuesta:', err);
            alert('Error al calificar la respuesta');
          }
        });
      }
    });
  }

  verEntrega(respuesta: AnswerResponseDTO) {
    console.log('👀 Ver entrega de respuesta:', respuesta);
    // Implementar visualización de entrega
  }

  descargarArchivos(respuesta: AnswerResponseDTO) {
    console.log('📥 Descargar archivos de respuesta:', respuesta);
    // Implementar descarga de archivos
  }

  aplicarFiltros() {
    this.respuestasFiltradas = this.respuestasPendientes.filter(respuesta => {
      if (this.filtroEstado === 'pendientes' && respuesta.score !== null) {
        return false;
      }
      if (this.filtroEstado === 'calificados' && respuesta.score === null) {
        return false;
      }
      return true;
    });
  }

  getEstadoRespuesta(respuesta: AnswerResponseDTO): string {
    return respuesta.score === null ? 'pendiente' : 'calificado';
  }

  getColorEstado(respuesta: AnswerResponseDTO): string {
    return respuesta.score === null ? 'warn' : 'primary';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get cantidadPendientes(): number {
    return this.respuestasPendientes.filter(r => r.score === null).length;
  }

  // ✅ Método para contar total
  get cantidadTotal(): number {
    return this.respuestasPendientes.length;
  }

  
}