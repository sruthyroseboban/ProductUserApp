import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppLayoutComponent } from '../../../core/layout/app-layout.component';
import { ProductService, Product } from '../../../core/services/product.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

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
    ConfirmDialogModule,
    DialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchValue: string = '';
  displayDialog: boolean = false;
  selectedProduct: Product = { 
    name: '', 
    price: 0, 
    dateOfManufacture: '', 
    dateOfExpiry: '' 
  };
  isEditMode = false;

  constructor(
    private productService: ProductService, 
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Admin gets all products
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
        console.log('Admin loaded products:', data);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to load products' 
        });
      }
    });
  }

  // 🔹 Show Create Dialog
  showCreateDialog() {
    this.isEditMode = false;
    this.selectedProduct = { 
      name: '', 
      price: 0, 
      dateOfManufacture: '', 
      dateOfExpiry: '' 
    };
    this.displayDialog = true;
  }

  // 🔹 Search Filter
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

  saveProduct(): void {
    // Validate
    if (!this.selectedProduct.name || !this.selectedProduct.price || 
        !this.selectedProduct.dateOfManufacture || !this.selectedProduct.dateOfExpiry) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validation', 
        detail: 'Please fill all required fields' 
      });
      return;
    }

    if (this.isEditMode && this.selectedProduct.id) {
      // Update existing product
      this.productService.update(this.selectedProduct.id, this.selectedProduct)
        .subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Product updated successfully' 
            });
            this.loadProducts();
            this.hideDialog();
          },
          error: (err) => {
            console.error('Failed to update product:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Failed to update product' 
            });
          }
        });
    } else {
      // Create new product
      this.productService.create(this.selectedProduct)
        .subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Product created successfully' 
            });
            this.loadProducts();
            this.hideDialog();
          },
          error: (err) => {
            console.error('Failed to create product:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Failed to create product' 
            });
          }
        });
    }
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  deleteProduct(id: string): void {
    if (!id) {
      console.error('Product ID is required');
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
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
            console.error('Failed to delete product:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Failed to delete product' 
            });
          }
        });
      }
    });
  }

  // 🔹 Hide Dialog
  hideDialog() {
    this.displayDialog = false;
    this.selectedProduct = { 
      name: '', 
      price: 0, 
      dateOfManufacture: '', 
      dateOfExpiry: '' 
    };
    this.isEditMode = false;
  }

  resetForm(): void {
    this.hideDialog();
  }
}
