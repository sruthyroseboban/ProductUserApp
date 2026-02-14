import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from '../../../core/layout/app-layout.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule, AppLayoutComponent, CardModule, TableModule],
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css']
})
export class UserProductsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
