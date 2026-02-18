import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppLayoutComponent } from '../../../core/layout/app-layout.component';
import { ProductService, Product, PagedResult } from '../../../core/services/product.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ImageViewerComponent } from '../../../shared/components/image-viewer/image-viewer.component';

interface ProductForm {
  id?: string;
  name: string;
  description?: string;
  price: number;
  dateOfManufacture: string;
  dateOfExpiry: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AppLayoutComponent, 
    CardModule, 
    InputTextModule,
    InputNumberModule, 
    ButtonModule, 
    TableModule, 
    DialogModule,
    ProgressBarModule,
    ToastModule,
    TooltipModule,
    ImageViewerComponent
  ],
  providers: [MessageService],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchValue: string = '';
  loading: boolean = false;
  displayDialog: boolean = false;
  isEditMode: boolean = false;

  // Pagination properties
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;

  // Image upload
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploading: boolean = false;

  // Filter properties
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
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(this.pageNumber, this.pageSize).subscribe({
      next: (data: PagedResult<Product>) => {
        this.products = data.items;
        this.filteredProducts = data.items;
        this.totalRecords = data.totalCount;
        this.loading = false;
        // Manually trigger change detection to update the table immediately
        this.cdr.detectChanges();

        if (data.items.length === 0 && data.totalCount === 0) {
          this.messageService.add({ 
            severity: 'info', 
            summary: 'No Products', 
            detail: 'No products found in the system.' 
          });
        }
      },
      error: (err) => {
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

  onPageChange(event: any): void {
    const newPageNumber = Math.floor(event.first / event.rows) + 1;
    const newPageSize = event.rows;

    if (newPageNumber !== this.pageNumber || newPageSize !== this.pageSize) {
      this.pageNumber = newPageNumber;
      this.pageSize = newPageSize;
      this.loadProducts();
    }
  }

  showCreateDialog() {
    this.isEditMode = false;
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
    this.displayDialog = true;
  }

  editProduct(product: Product) {
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
    // Trigger change detection to ensure form values are displayed immediately
    this.cdr.detectChanges();
  }

  async saveProduct() {
    // Validate required fields
    if (!this.productForm.name || !this.productForm.price || 
        !this.productForm.dateOfManufacture || !this.productForm.dateOfExpiry) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validation', 
        detail: 'Please fill all required fields' 
      });
      return;
    }

    // Validate date range
    const manufactureDate = new Date(this.productForm.dateOfManufacture);
    const expiryDate = new Date(this.productForm.dateOfExpiry);

    if (manufactureDate >= expiryDate) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Date of Manufacture must be before Date of Expiry' 
      });
      return;
    }

    // Upload image if selected
    let imageUrl = this.productForm.imageUrl;
    if (this.selectedFile) {
      this.uploading = true;
      try {
        const uploadResult = await this.productService.uploadImage(this.selectedFile).toPromise();
        imageUrl = uploadResult?.imageUrl;
        this.messageService.add({
          severity: 'success',
          summary: 'Image Uploaded',
          detail: 'Product image uploaded successfully'
        });
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: 'Failed to upload image'
        });
        this.uploading = false;
        return;
      }
      this.uploading = false;
    }

    // Prepare product data
    const productData = {
      ...this.productForm,
      dateOfManufacture: new Date(this.productForm.dateOfManufacture).toISOString(),
      dateOfExpiry: new Date(this.productForm.dateOfExpiry).toISOString(),
      imageUrl: imageUrl
    };

    if (this.isEditMode && this.productForm.id) {
      // Update existing product
      this.productService.update(this.productForm.id, productData).subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Product updated successfully' 
          });
          this.hideDialog();
          this.loadProducts();
        },
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to update product' 
          });
        }
      });
    } else {
      // Create new product
      this.productService.create(productData as Product).subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Product created successfully' 
          });
          this.hideDialog();
          this.loadProducts();
        },
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to create product' 
          });
        }
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Product deleted successfully' 
          });
          this.loadProducts();
        },
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete product' 
          });
        }
      });
    }
  }

  hideDialog() {
    this.displayDialog = false;
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

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Search by name or description
    if (this.searchValue) {
      const searchLower = this.searchValue.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower)) ||
        p.price.toString().includes(searchLower)
      );
    }

    // Filter by price range
    if (this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }

    // Filter by date range
    if (this.startDate) {
      const startDateTime = new Date(this.startDate).getTime();
      filtered = filtered.filter(p => new Date(p.dateOfManufacture).getTime() >= startDateTime);
    }
    // Expiry date filter removed - not needed

    this.filteredProducts = filtered;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  clearFilters() {
    this.searchValue = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.startDate = '';
    this.filteredProducts = this.products;

    this.messageService.add({
      severity: 'info',
      summary: 'Filters Cleared',
      detail: 'All filters have been reset'
    });
  }

  // Image handling methods
  onFileSelected(event: any) {
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

    // Generate preview
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

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.imageUrl = undefined;
  }

  viewImage(imageUrl: string) {
    this.imageViewer.open(imageUrl);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
