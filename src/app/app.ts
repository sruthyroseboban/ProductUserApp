import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <h2>Products</h2>

    <p-table [value]="products" [tableStyle]="{'min-width': '50rem'}">
      <ng-template pTemplate="header">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Created At</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-product>
        <tr>
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.createdAt }}</td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class AppComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAll().subscribe(data => {
      this.products = data;
    });
  }
}
