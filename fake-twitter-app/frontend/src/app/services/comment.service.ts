// src/app/services/comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Exportáljunk egy Comment interfészt
export interface Comment {
  _id: string;
  user: { _id: string; username: string; email: string };
  tweet: string;
  content: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private base = `/api/comments`;

  constructor(private http: HttpClient) {}

  /** Egy tweet-hez tartozó kommentek lekérése */
  getByTweet(tweetId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.base}/tweet/${tweetId}`);
  }

  /** Új komment létrehozása */
  create(tweetId: string, content: string): Observable<Comment> {
    return this.http.post<Comment>(this.base, { tweet: tweetId, content });
  }

  /** Komment frissítése */
  update(id: string, content: string): Observable<Comment> {
    return this.http.patch<Comment>(`${this.base}/${id}`, { content });
  }

  /** Komment törlése */
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
