import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppLayoutComponent } from '../../../core/layout/app-layout.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Table } from 'primeng/table';
import { ProductService, Product, PagedResult } from '../../../core/services/product.service';
import { MessageService } from 'primeng/api';
import { ImageViewerComponent } from '../../../shared/components/image-viewer/image-viewer.component';

interface ProductForm {
  id?: string;
  name: string;
  description?: string;
  price: number;
  dateOfManufacture: string;
  dateOfExpiry?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppLayoutComponent,
    CardModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    ProgressBarModule,
    ToastModule,
    TooltipModule,
    ImageViewerComponent
  ],
  providers: [MessageService],
  templateUrl: './user-products.component.html',
  styleUrl: './user-products.component.css'
})
export class UserProductsComponent implements OnInit {

  products: Product[] = [];
  loading = false;

  totalRecords = 0;
  pageNumber = 1;
  pageSize = 5;

  displayDialog = false;
  isEditMode = false;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploading = false;

  // Filter properties
  searchValue: string = '';
  showFilters: boolean = false;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  startDate: string = '';

  productForm: ProductForm = {
    name: '',
    description: '',
    price: 0,
    dateOfManufacture: '',
    dateOfExpiry: '',
    imageUrl: undefined
  };

  @ViewChild('dt') table!: Table;
  @ViewChild('imageViewer') imageViewer!: ImageViewerComponent;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Nothing here — PrimeNG lazy will trigger automatically
  }


  onLazyLoad(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getMyProducts(this.pageNumber, this.pageSize)
      .subscribe({
        next: (data: PagedResult<Product>) => {
          this.products = data.items;
          this.totalRecords = data.totalCount;
          this.loading = false;
          // Manually trigger change detection to update the table immediately
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load products'
          });
        }
      });
  }

  showCreateDialog(): void {
    this.isEditMode = false;
    this.resetForm();
    this.displayDialog = true;
  }

  editProduct(product: Product): void {
    this.isEditMode = true;
    this.productForm = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      dateOfManufacture: product.dateOfManufacture?.split('T')[0] || '',
      dateOfExpiry: product.dateOfExpiry?.split('T')[0] || '',
      imageUrl: product.imageUrl
    };
    this.imagePreview = product.imageUrl || null;
    this.displayDialog = true;
  }

  saveProduct(): void {

    if (!this.productForm.name || !this.productForm.price || !this.productForm.dateOfManufacture) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill required fields'
      });
      return;
    }

    const manufactureDate = new Date(this.productForm.dateOfManufacture);
    const expiryDate = this.productForm.dateOfExpiry
      ? new Date(this.productForm.dateOfExpiry)
      : null;

    if (expiryDate && manufactureDate >= expiryDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'Manufacture date must be before expiry date'
      });
      return;
    }

    // Upload image first if file is selected
    if (this.selectedFile) {
      this.uploading = true;
      this.productService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.uploading = false;
          this.productForm.imageUrl = response.imageUrl;
          this.saveProductData();
        },
        error: (error) => {
          this.uploading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to upload image'
          });
        }
      });
    } else {
      this.saveProductData();
    }
  }

  private saveProductData(): void {
    const manufactureDate = new Date(this.productForm.dateOfManufacture);
    const expiryDate = this.productForm.dateOfExpiry
      ? new Date(this.productForm.dateOfExpiry)
      : null;

    const productData = {
      ...this.productForm,
      dateOfManufacture: manufactureDate.toISOString(),
      dateOfExpiry: expiryDate?.toISOString(),
      imageUrl: this.productForm.imageUrl
    };

    if (this.isEditMode && this.productForm.id) {
      this.productService.update(this.productForm.id, productData)
        .subscribe(() => this.afterSave('Product updated successfully'));
    } else {
      this.productService.create(productData as Product)
        .subscribe(() => this.afterSave('Product created successfully'));
    }
  }

  private afterSave(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message
    });
    this.displayDialog = false;
    this.loadProducts();
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Product deleted successfully'
        });
        this.loadProducts();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete product'
        });
      }
    });
  }

  resetForm(): void {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      dateOfManufacture: '',
      dateOfExpiry: '',
      imageUrl: undefined
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.resetForm();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Only image files are allowed'
      });
      event.target.value = ''; // Clear the input
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: 'Image size must be under 5MB'
      });
      event.target.value = ''; // Clear the input
      return;
    }

    this.selectedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);

    // Show success message
    this.messageService.add({
      severity: 'success',
      summary: 'Image Selected',
      detail: `${file.name} (${this.formatFileSize(file.size)})`
    });
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.imageUrl = undefined;
  }

  viewImage(imageUrl: string): void {
    this.imageViewer.open(imageUrl);
  }

  // Filter methods
  onSearch(): void {
    this.table.filterGlobal(this.searchValue, 'contains');
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    // Trigger table filtering
    if (this.table) {
      this.table.filter(this.minPrice, 'price', 'gte');
      this.table.filter(this.maxPrice, 'price', 'lte');
    }
  }

  clearFilters(): void {
    this.searchValue = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.startDate = '';
    this.showFilters = false;
    if (this.table) {
      this.table.clear();
    }
    this.loadProducts();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
