import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ message: string }>(`${this.base}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.setItem('isLoggedIn', 'true');
        })
      );
  }

  register(data: { email: string; username: string; password: string }) {
    return this.http.post<{ message: string }>(`${this.base}/register`, data);
  }

  logout() {
    return this.http
      .post<{ message: string }>(`${this.base}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.removeItem('isLoggedIn');
          this.router.navigate(['/login']);
        })
      );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
