import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true"
      [dismissableMask]="true"
      [closable]="true"
      [style]="{ width: '90vw', height: '90vh' }"
      [contentStyle]="{ padding: 0, overflow: 'hidden' }"
      styleClass="image-viewer-dialog">
      
      <div class="image-container">
        <img [src]="imageUrl" [alt]="'Product Image'" class="full-image" />
      </div>
      
      <ng-template pTemplate="footer">
        <button pButton 
                type="button" 
                label="Close" 
                icon="pi pi-times"
                (click)="close()"
                severity="secondary">
        </button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .image-viewer-dialog .p-dialog-header {
      background: #1e293b;
      color: #fff;
      padding: 1rem;
    }

    :host ::ng-deep .image-viewer-dialog .p-dialog-content {
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      height: calc(90vh - 120px);
    }

    :host ::ng-deep .image-viewer-dialog .p-dialog-footer {
      background: #1e293b;
      padding: 1rem;
      border-top: 1px solid #334155;
    }

    .image-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
    }

    .full-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      cursor: zoom-in;
    }
  `]
})
export class ImageViewerComponent {
  @Input() imageUrl: string = '';
  visible: boolean = false;

  open(imageUrl: string) {
    this.imageUrl = imageUrl;
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}
