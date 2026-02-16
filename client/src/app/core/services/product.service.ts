import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id?: string;  // MongoDB uses string IDs (ObjectId)
  name: string;
  price: number;
  dateOfManufacture: string;
  dateOfExpiry: string;
  createdByUserId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;  // Gateway routes /products to ProductService

  constructor(private http: HttpClient) { }

  /**
   * Get products based on user role:
   * - Admin: Returns all products
   * - User: Returns only user's products
   * Backend handles filtering automatically based on JWT
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Get all products (Admin only)
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }

  /**
   * Get only the logged-in user's products
   */
  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/my-products`);
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
}
