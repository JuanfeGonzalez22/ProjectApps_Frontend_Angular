// src/app/student/pages/evaluation-dialog/evaluation-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EvaluationData } from '../../../core/models/evaluation.model';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { FileResourceService, FileResourceDTO } from '../../../core/services/file-resource.service';

@Component({
  selector: 'app-evaluation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
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
  submittedFileUrl: string = '';

  // Constantes de validación
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  readonly ALLOWED_TYPES = ['application/pdf'];

  constructor(
    public dialogRef: MatDialogRef<EvaluationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { evaluation: EvaluationData; viewMode?: boolean },
    private evaluationService: EvaluationService,
    private fileResourceService: FileResourceService,
    private snackBar: MatSnackBar
  ) {
    this.evaluation = data.evaluation;
    this.viewMode = data.viewMode || false;
  }

  ngOnInit() {
    console.log('📋 Evaluation Dialog abierto:', this.evaluation);

    if (this.viewMode) {
      this.cargarArchivoEnviado();
    }
  }

  /**
   * Carga el archivo enviado previamente (modo visualización)
   */
  cargarArchivoEnviado() {
    if (this.evaluation.id) {
      this.fileResourceService.getFileResourcesByEvaluation(this.evaluation.id).subscribe({
        next: (resources) => {
          if (resources && resources.length > 0) {
            const fileResource = resources[0];
            this.fileName = fileResource.fileName;
            this.submittedFileUrl = fileResource.fileUrl || '';
            console.log('📄 Archivo cargado:', fileResource);
          }
        },
        error: (err) => {
          console.error('❌ Error cargando archivo enviado:', err);
        }
      });
    }
  }

  /**
   * Maneja la selección de archivo
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    // Validar tipo de archivo
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.uploadError = 'Solo se permiten archivos PDF';
      this.selectedFile = null;
      this.fileName = '';
      this.showError('Solo se permiten archivos PDF');
      return;
    }

    // Validar tamaño de archivo
    if (file.size > this.MAX_FILE_SIZE) {
      this.uploadError = 'El archivo no debe superar los 10MB';
      this.selectedFile = null;
      this.fileName = '';
      this.showError('El archivo no debe superar los 10MB');
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.uploadError = '';

    console.log('📄 Archivo seleccionado:', {
      nombre: file.name,
      tamaño: this.formatFileSize(file.size),
      tipo: file.type
    });

    this.showSuccess('Archivo seleccionado correctamente');
  }

  /**
   * Activa el input de archivo
   */
  triggerFileInput() {
    if (this.uploading) return;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  /**
   * Remueve el archivo seleccionado
   */
  removeFile() {
    this.selectedFile = null;
    this.fileName = '';
    this.uploadError = '';

    // Limpiar el input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Envía la respuesta de la evaluación
   */
  async enviarRespuesta() {
    if (!this.selectedFile) {
      this.uploadError = 'Debes seleccionar un archivo antes de enviar';
      this.showError('Debes seleccionar un archivo antes de enviar');
      return;
    }

    this.uploading = true;
    this.uploadError = '';

    console.log('📤 Iniciando proceso de envío de evaluación...');

    try {
      // Paso 1: Subir el archivo al servidor y obtener la URL
      console.log('📤 Paso 1: Subiendo archivo al servidor...');

      this.fileResourceService.uploadFile(this.selectedFile).subscribe({
        next: (fileUrl) => {
          console.log('✅ Archivo subido correctamente. URL:', fileUrl);

          // Paso 2: Crear el registro del recurso de archivo
          const fileResource: FileResourceDTO = {
            fileName: this.selectedFile!.name,
            fileType: this.selectedFile!.type,
            evaluationId: this.evaluation.id,
            fileUrl: fileUrl
          };

          console.log('💾 Paso 2: Guardando recurso de archivo en BD...');

          this.fileResourceService.createFileResource(fileResource).subscribe({
            next: (savedResource) => {
              console.log('✅ Recurso guardado exitosamente:', savedResource);

              // Paso 3: Marcar la evaluación como enviada (si tienes ese endpoint)
              // Si no tienes un endpoint específico para esto, solo cierra el diálogo
              console.log('✅ Evaluación enviada exitosamente');

              this.uploading = false;
              this.showSuccess('¡Evaluación enviada correctamente!');

              // Cerrar el diálogo con resultado exitoso
              this.dialogRef.close({
                success: true,
                fileResource: savedResource
              });
            },
            error: (err) => {
              console.error('❌ Error guardando recurso de archivo:', err);
              this.uploadError = 'Error al guardar el archivo en el sistema';
              this.showError('Error al guardar el archivo en el sistema');
              this.uploading = false;
            }
          });
        },
        error: (err) => {
          console.error('❌ Error subiendo archivo:', err);
          this.uploadError = 'Error al subir el archivo. Intenta nuevamente.';
          this.showError('Error al subir el archivo');
          this.uploading = false;
        }
      });

    } catch (error) {
      console.error('❌ Error en el proceso:', error);
      this.uploadError = 'Error inesperado. Intenta nuevamente.';
      this.showError('Error inesperado al procesar el archivo');
      this.uploading = false;
    }
  }

  /**
   * Descarga el archivo enviado
   */
  descargarArchivo() {
    if (this.submittedFileUrl) {
      console.log('📥 Descargando archivo:', this.submittedFileUrl);
      window.open(this.submittedFileUrl, '_blank');
    } else {
      this.showError('No se pudo encontrar el archivo');
    }
  }

  /**
   * Cancela y cierra el diálogo
   */
  cancelar() {
    if (this.uploading) {
      const confirmar = confirm('Hay una subida en progreso. ¿Deseas cancelar?');
      if (!confirmar) return;
    }
    this.dialogRef.close();
  }

  /**
   * Obtiene la fecha de entrega formateada
   */
  getDueDate(): string {
    if (this.evaluation.dueDate) {
      const date = new Date(this.evaluation.dueDate);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Sin fecha límite';
  }

  /**
   * Obtiene la descripción de la evaluación
   */
  getDescription(): string {
    return this.evaluation.description || 'Resuelve los ejercicios del módulo y súbelos en un documento PDF.';
  }

  /**
   * Formatea el tamaño del archivo
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Muestra mensaje de éxito
   */
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Muestra mensaje de error
   */
  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
