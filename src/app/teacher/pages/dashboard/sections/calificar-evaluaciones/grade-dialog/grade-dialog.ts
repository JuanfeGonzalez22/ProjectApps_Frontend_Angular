import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';

// Si el servicio no existe aún, crea estas interfaces aquí temporalmente
export interface AnswerResponseDTO {
  id: number;
  date: string;
  evaluationId: number;
  userId: number;
  score: number | null;
}

export interface GradeAnswerDTO {
  score: number;
  feedback?: string;
}

export interface GradeDialogData {
  respuesta: AnswerResponseDTO;
  maxScore: number;
}

@Component({
  selector: 'app-grade-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule
  ],
  template: `
    <div class="grade-dialog">
      <h2 mat-dialog-title>Calificar Evaluación</h2>
      
      <mat-dialog-content>
        <div class="dialog-content">
          <!-- Información de la evaluación -->
          <div class="evaluation-info">
            <h3>Información de la Evaluación</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>ID Respuesta:</strong> {{data.respuesta.id}}
              </div>
              <div class="info-item">
                <strong>ID Evaluación:</strong> {{data.respuesta.evaluationId}}
              </div>
              <div class="info-item">
                <strong>ID Estudiante:</strong> {{data.respuesta.userId}}
              </div>
              <div class="info-item">
                <strong>Fecha de envío:</strong> {{formatDate(data.respuesta.date)}}
              </div>
            </div>
          </div>

          <!-- Formulario de calificación -->
          <form [formGroup]="gradeForm" class="grade-form">
            <div class="form-section">
              <h3>Calificación</h3>
              
              <!-- Slider para calificación -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Puntaje (0 - {{data.maxScore}})</mat-label>
                <input matInput type="number" formControlName="score" 
                       [min]="0" [max]="data.maxScore" step="0.5">
                <span matTextSuffix>/ {{data.maxScore}}</span>
                <mat-error *ngIf="gradeForm.get('score')?.hasError('required')">
                  El puntaje es requerido
                </mat-error>
                <mat-error *ngIf="gradeForm.get('score')?.hasError('min')">
                  El puntaje mínimo es 0
                </mat-error>
                <mat-error *ngIf="gradeForm.get('score')?.hasError('max')">
                  El puntaje máximo es {{data.maxScore}}
                </mat-error>
              </mat-form-field>

              <!-- Slider visual -->
              <div class="slider-container">
                <mat-slider [min]="0" [max]="data.maxScore" [step]="1"
                           [displayWith]="formatLabel"
                           formControlName="score" class="full-width">
                  <input matSliderThumb formControlName="score">
                </mat-slider>
              </div>

              <!-- Feedback -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Comentarios / Feedback</mat-label>
                <textarea matInput formControlName="feedback" rows="4" 
                         placeholder="Proporciona comentarios constructivos para el estudiante..."></textarea>
                <mat-hint>Opcional - Este feedback será visible para el estudiante</mat-hint>
              </mat-form-field>
            </div>

            <!-- Resumen de calificación -->
            <div class="grade-summary" *ngIf="gradeForm.get('score')?.value !== null">
              <h4>Resumen de Calificación</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Puntaje:</span>
                  <span class="value">{{gradeForm.get('score')?.value || 0}}/{{data.maxScore}}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Porcentaje:</span>
                  <span class="value">{{calculatePercentage()}}%</span>
                </div>
                <div class="summary-item">
                  <span class="label">Estado:</span>
                  <span class="value" [class]="getStatusClass()">{{getStatusText()}}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" 
                (click)="onSubmit()" 
                [disabled]="!gradeForm.valid">
          <mat-icon>save</mat-icon>
          Guardar Calificación
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .grade-dialog {
      min-width: 500px;
      max-width: 600px;
    }

    .dialog-content {
      padding: 1rem 0;
    }

    .evaluation-info {
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      
      h3 {
        margin: 0 0 1rem 0;
        color: #2e7be7;
        font-size: 1.1rem;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      
      .info-item {
        strong {
          color: #333;
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        span {
          color: #666;
          font-size: 0.9rem;
        }
      }
    }

    .grade-form {
      .form-section {
        h3 {
          margin: 0 0 1rem 0;
          color: #2e7be7;
        }
      }
    }

    .full-width {
      width: 100%;
    }

    .slider-container {
      margin: 1rem 0 2rem 0;
      
      mat-slider {
        width: 100%;
      }
    }

    .grade-summary {
      margin-top: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      color: white;
      
      h4 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
      }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      
      .summary-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        
        .label {
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .value {
          font-size: 1.1rem;
          font-weight: bold;
          
          &.status-excellent {
            color: #4caf50;
          }
          
          &.status-good {
            color: #8bc34a;
          }
          
          &.status-pass {
            color: #ff9800;
          }
          
          &.status-fail {
            color: #f44336;
          }
        }
      }
    }

    mat-dialog-actions {
      padding: 1rem 0 0 0;
      gap: 0.5rem;
    }

    /* Estilos responsivos */
    @media (max-width: 600px) {
      .grade-dialog {
        min-width: auto;
        width: 95vw;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GradeDialogComponent {
  gradeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GradeDialogData,
    private fb: FormBuilder
  ) {
    this.gradeForm = this.fb.group({
      score: [0, [Validators.required, Validators.min(0), Validators.max(this.data.maxScore)]],
      feedback: ['']
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  calculatePercentage(): number {
    const score = this.gradeForm.get('score')?.value || 0;
    return Math.round((score / this.data.maxScore) * 100);
  }

  getStatusText(): string {
    const percentage = this.calculatePercentage();
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 80) return 'Muy Bueno';
    if (percentage >= 70) return 'Bueno';
    if (percentage >= 60) return 'Aprobado';
    return 'No Aprobado';
  }

  getStatusClass(): string {
    const percentage = this.calculatePercentage();
    if (percentage >= 80) return 'status-excellent';
    if (percentage >= 70) return 'status-good';
    if (percentage >= 60) return 'status-pass';
    return 'status-fail';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.gradeForm.valid) {
      const gradeData: GradeAnswerDTO = {
        score: this.gradeForm.value.score,
        feedback: this.gradeForm.value.feedback
      };
      this.dialogRef.close(gradeData);
    }
  }
}