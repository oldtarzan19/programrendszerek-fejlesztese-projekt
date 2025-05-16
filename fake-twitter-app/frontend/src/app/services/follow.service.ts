import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Follow {
  _id: string;
  follower: { _id: string; username: string; email: string };
  following: { _id: string; username: string; email: string };
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private base = `/api/follows`;

  constructor(private http: HttpClient) {}

  /** Egy user követőinek lekérdezése */
  getFollowers(userId: string): Observable<Follow[]> {
    return this.http.get<Follow[]>(`${this.base}/${userId}/followers`);
  }

  /** Egy user által követettek lekérdezése */
  getFollowing(userId: string): Observable<Follow[]> {
    return this.http.get<Follow[]>(`${this.base}/${userId}/following`);
  }

  /** Követési kapcsolat létrehozása */
  follow(userToFollowId: string): Observable<Follow> {
    return this.http.post<Follow>(this.base, { following: userToFollowId });
  }

  /** Követési kapcsolat megszüntetése */
  unfollow(followRelationId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${followRelationId}`);
  }
}
