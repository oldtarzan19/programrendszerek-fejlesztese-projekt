// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse {
  message: string;
  user: { _id: string; username: string; email: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<LoginResponse>(`${this.base}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(res => {
          // Belépéskor elmentjük a userId-t és a login flag-et
          localStorage.setItem('userId', res.user._id);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', res.user.role);
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
          localStorage.removeItem('userId');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userRole');
          this.router.navigate(['/login']);
        })
      );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  /** Az aktuálisan belépett felhasználó ID-ja, vagy null ha nincs bejelentkezve */
  get currentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  get currentUserRole(): 'admin' | 'user' | null {
    return (localStorage.getItem('userRole') as 'admin' | 'user') ?? null;
  }

  get isAdmin(): boolean {
    return this.currentUserRole === 'admin';
  }
}
