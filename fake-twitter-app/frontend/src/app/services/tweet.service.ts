import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tweet {
  _id: string;
  user: { _id: string; username: string; email: string };
  content: string;
  createdAt: string;
  likes: string[];
  retweetOf?: string;
}

@Injectable({ providedIn: 'root' })
export class TweetService {
  private base = `/api/tweets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.base);
  }


 getByUser(userId: string): Observable<Tweet[]> {
       return this.http.get<Tweet[]>(`${this.base}?user=${userId}`);
 }

  create(content: string): Observable<Tweet> {
    return this.http.post<Tweet>(this.base, { content });
  }

  like(id: string): Observable<Tweet> {
    return this.http.post<Tweet>(`${this.base}/${id}/like`, {});
  }

  unlike(id: string): Observable<Tweet> {
    return this.http.post<Tweet>(`${this.base}/${id}/unlike`, {});
  }

  retweet(id: string): Observable<Tweet> {
    return this.http.post<Tweet>(`${this.base}/${id}/retweet`, {});
  }

 /** Tweet törlése */
 delete(id: string): Observable<{ message: string }> {
       return this.http.delete<{ message: string }>(`${this.base}/${id}`);
     }
}
