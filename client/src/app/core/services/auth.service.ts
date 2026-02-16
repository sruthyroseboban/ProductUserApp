import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/users`; // Gateway routes /users to UserService

  constructor(private http: HttpClient, private router: Router) { }

  login(data: any): Observable<LoginResponse> {
    console.log('Login request to Gateway:', data);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          if (response.accessToken && response.refreshToken) {
            this.setTokens(response.accessToken, response.refreshToken);
            console.log('Tokens saved successfully');
          }
        })
      );
  }

  register(data: any): Observable<any> {
    console.log('Register request to Gateway:', data);
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Legacy support - for components still using getToken()
  getToken(): string | null {
    return this.getAccessToken();
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.accessToken && response.refreshToken) {
            this.setTokens(response.accessToken, response.refreshToken);
            console.log('Tokens refreshed successfully');
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (expiry < now) {
        console.log('Access token expired');
        // Don't logout immediately - let interceptor try to refresh
        return false;
      }

      return true;
    } catch (e) {
      console.error('Invalid token', e);
      return false;
    }
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role'] || payload['Role'] || null;
    } catch (e) {
      console.error('Failed to parse token', e);
      return null;
    }
  }

  getUserId(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload['sub'] || payload['nameid'] || payload['userId'];
      return userId ? parseInt(userId, 10) : null;
    } catch (e) {
      console.error('Failed to parse token', e);
      return null;
    }
  }

  getUserEmail(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['email'] || null;
    } catch (e) {
      console.error('Failed to parse token', e);
      return null;
    }
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
