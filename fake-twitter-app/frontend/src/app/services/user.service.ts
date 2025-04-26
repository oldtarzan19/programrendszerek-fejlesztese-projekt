import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  isSuspended: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `/api/users`;

  constructor(private http: HttpClient) {}

  /** Saját vagy bármelyik user profiljának lekérése */
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  /** Saját profil adatainak frissítése */
  update(id: string, updates: Partial<Pick<User, 'email' | 'username'>>): Observable<User> {
    return this.http.patch<User>(`${this.base}/${id}`, updates);
  }

  /** Összes user lekérése (admin) */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  /** Felhasználó felfüggesztése (admin) */
  suspend(id: string): Observable<User> {
    return this.http.patch<User>(`${this.base}/${id}/suspend`, {});
  }

  unsuspend(id: string): Observable<User> {
    return this.http.patch<User>(`${this.base}/${id}/unsuspend`, {});
  }

  /** Felhasználó törlése (admin vagy saját) */
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
