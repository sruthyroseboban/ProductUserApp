import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id?: string;  // MongoDB uses string IDs (ObjectId)
  name: string;
  description?: string;
  price: number;
  dateOfManufacture: string;
  dateOfExpiry?: string;
  createdByUserId?: number;
  imageUrl?: string; 
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;  // Gateway routes /products to ProductService

  constructor(private http: HttpClient) { }

  /**
   * Get products based on user role (with pagination):
   * - Admin: Returns all products
   * - User: Returns only user's products
   * Backend handles filtering automatically based on JWT
   */
  getProducts(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Product>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<Product>>(this.apiUrl, { params });
  }

  /**
   * Get all products (Admin only) with pagination
   */
  getAllProducts(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Product>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<Product>>(`${this.apiUrl}/all`, { params });
  }

  /**
   * Get only the logged-in user's products with pagination
   */
  getMyProducts(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Product>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<Product>>(`${this.apiUrl}/my-products`, { params });
  }

  /**
   * Get product by ID
   */
  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get products by specific user ID (Admin only)
   */
  getByUserId(userId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Create new product
   * UserId is automatically set from JWT on backend
   */
  create(product: Product): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, product);
  }

  /**
   * Update product
   * Users can only update their own products, Admins can update any
   */
  update(id: string, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { ...product, id });
  }

  /**
   * Delete product
   * Users can only delete their own products, Admins can delete any
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Upload product image to MinIO
   */
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, formData);
  }
}
