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
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, AppLayoutComponent, CardModule, InputTextModule, InputNumberModule, ButtonModule, TableModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  selectedProduct: Product = { id: 0, name: '', price: 0, dateOfManufacture:'',dateOfExpiry:'' };
  isEditMode = false;

  constructor(private productService: ProductService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(data => {
      this.products = data;
    });
  }

  saveProduct() {
    if (this.isEditMode && this.selectedProduct.id) {
      this.productService.update(this.selectedProduct.id, this.selectedProduct)
        .subscribe(() => {
          this.loadProducts();
          this.resetForm();
        });
    } else {
      this.productService.create(this.selectedProduct)
        .subscribe(() => {
          this.loadProducts();
          this.resetForm();
        });
    }
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.isEditMode = true;
  }

  deleteProduct(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.delete(id).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  resetForm() {
    this.selectedProduct = { name: '', price: 0, dateOfManufacture: '', dateOfExpiry: '' };
    this.isEditMode = false;
  }
}
