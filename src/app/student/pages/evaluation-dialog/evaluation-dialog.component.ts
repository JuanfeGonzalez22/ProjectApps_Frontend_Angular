// src/app/student/pages/evaluation-dialog/evaluation-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EvaluationData } from '../../../core/models/evaluation.model';
import { EvaluationService } from '../../../core/services/evaluation.service';

@Component({
  selector: 'app-evaluation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './evaluation-dialog.component.html',
  styleUrls: ['./evaluation-dialog.component.scss']
})
export class EvaluationDialogComponent implements OnInit {
  evaluation: EvaluationData;
  viewMode: boolean = false;
  selectedFile: File | null = null;
  fileName: string = '';
  uploading: boolean = false;
  uploadError: string = '';

  constructor(
    public dialogRef: MatDialogRef<EvaluationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { evaluation: EvaluationData; viewMode?: boolean },
    private evaluationService: EvaluationService
  ) {
    this.evaluation = data.evaluation;
    this.viewMode = data.viewMode || false;
  }

  ngOnInit() {
    console.log('📝 Evaluation Dialog abierto:', this.evaluation);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo (solo PDF por ahora)
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.fileName = file.name;
        this.uploadError = '';
        console.log('📄 Archivo seleccionado:', file.name);
      } else {
        this.uploadError = 'Solo se permiten archivos PDF';
        this.selectedFile = null;
        this.fileName = '';
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  removeFile() {
    this.selectedFile = null;
    this.fileName = '';
    this.uploadError = '';
  }

  enviarRespuesta() {
    if (!this.selectedFile) {
      this.uploadError = 'Debes seleccionar un archivo antes de enviar';
      return;
    }

    this.uploading = true;
    this.uploadError = '';

    this.evaluationService.submitEvaluation(this.evaluation.id!, this.selectedFile).subscribe({
      next: (result) => {
        console.log('✅ Evaluación enviada:', result);
        this.uploading = false;
        this.dialogRef.close(result);
      },
      error: (err) => {
        console.error('❌ Error enviando evaluación:', err);
        this.uploadError = 'Error al enviar la evaluación. Intenta nuevamente.';
        this.uploading = false;
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  getDueDate(): string {
    // Por ahora fecha fija, esto debe venir del backend
    return '2025-10-23';
  }

  getDescription(): string {
    // Descripción de ejemplo, debe venir del backend
    return 'Resuelve los ejercicios del módulo y súbelos en un documento PDF.';
  }
}
