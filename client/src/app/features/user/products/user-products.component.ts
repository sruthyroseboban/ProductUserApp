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
import { Table } from 'primeng/table';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css']
})
export class UserProductsComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  searchValue: string = '';
  loading: boolean = false;
  displayDialog: boolean = false;
  isEditMode: boolean = false;

  productForm: any = {
    id: null,
    name: '',
    price: 0,
    dateOfManufacture: '',
    dateOfExpiry: ''
  };

  @ViewChild('dt') table!: Table;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    this.productService.getMyProducts().subscribe({
      next: (products) => {
        console.log('User products:', products);
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;

        // Manually trigger change detection to prevent ExpressionChangedAfterItHasBeenCheckedError
        this.cdr.detectChanges();

        if (products.length === 0) {
          this.messageService.add({ 
            severity: 'info', 
            summary: 'No Products', 
            detail: 'You haven\'t created any products yet. Click "Create Product" to get started!' 
          });
        }
      },
      error: (err) => {
        console.error('Error fetching user products:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to load products' 
        });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Create Modal
  showCreateDialog() {
    this.isEditMode = false;
    this.productForm = {
      id: null,
      name: '',
      price: 0,
      dateOfManufacture: '',
      dateOfExpiry: ''
    };
    this.displayDialog = true;
  }

  // Edit Product
  editProduct(product: any) {
    this.isEditMode = true;
    this.productForm = {
      id: product.id,
      name: product.name,
      price: product.price,
      dateOfManufacture: product.dateOfManufacture,
      dateOfExpiry: product.dateOfExpiry
    };
    this.displayDialog = true;
  }

  saveProduct() {
    if (!this.productForm.name || !this.productForm.price || 
        !this.productForm.dateOfManufacture || !this.productForm.dateOfExpiry) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validation', 
        detail: 'Please fill all required fields' 
      });
      return;
    }

    const productData = { ...this.productForm };

    if (this.isEditMode) {
      // Update existing product
      this.productService.update(productData.id, productData).subscribe({
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
          console.error('Error updating product:', err);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to update product' 
          });
        }
      });
    } else {
      // Create new product
      this.productService.create(productData).subscribe({
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
          console.error('Error creating product:', err);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to create product' 
          });
        }
      });
    }
  }

  // Delete Product
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
          console.error('Error deleting product:', err);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete product' 
          });
        }
      });
    }
  }

  // Hide Modal and Reset Form
  hideDialog() {
    this.displayDialog = false;
    this.productForm = {
      id: null,
      name: '',
      price: 0,
      dateOfManufacture: '',
      dateOfExpiry: ''
    };
  }

  // Manual Search Filter
  onSearch() {
    if (!this.searchValue) {
      this.filteredProducts = this.products;
      return;
    }

    const searchLower = this.searchValue.toLowerCase();
    this.filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.price.toString().includes(searchLower)
    );
  }

}
